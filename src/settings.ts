import merge from "deepmerge"
import { read_json } from "./file"

export interface ServerSettings {
	port: number
}

export interface LoggerSettings {
	level: string
}

export class Settings {
	base: Record<string, unknown>

	constructor(base: Record<string, unknown> = { }) {
		this.base = base
	}

	get_server(): ServerSettings {
		return this.base.server as ServerSettings || {
			port: process.env.PORT || "80"
		}
	}

	get_logger(): LoggerSettings {
		return this.base.logger as LoggerSettings || {
			level: process.env.LOG_LEVEL || "info"
		}
	}
}

export const load = async (name: string): Promise<Settings> => {
	//paths where to search for config files
	const paths = [
		`/etc/${ name }rc.json`,
		`~/${ name }rc.json`,
		`${ name }rc.json`
	]

	//load the config files
	const configs = await Promise.all(paths.map(async path => {
		try {
			return await read_json(path)
		} catch(error) {
			if(error.code == "ENOENT") {
				return { }
			} else {
				throw error
			}
		}
	}))

	//merge the config files -> specific overrides
	const base = configs.reduce((a, b) => merge(a, b), { })

	return new Settings(base)
}
