import merge from "deepmerge"

export interface ServerSettings {
	port: number
}

export interface LoggerSettings {
	level: string
}

export class Settings {
	server: ServerSettings
	logger: LoggerSettings

	constructor(server: ServerSettings, logger: LoggerSettings) {
		this.server = server
		this.logger = logger
	}

	get_server(): ServerSettings {
		return this.server || {
			port: process.env.PORT || "80"
		}
	}

	get_logger(): LoggerSettings {
		return this.logger || {
			level: process.env.LOG_LEVEL || "info"
		}
	}
}

export const load = async (name: string) => {
	const paths = [
		`/etc/${ name }rc.json`,
		`~/${ name }rc.json`,
		`${ name }rc.json`
	]
}
