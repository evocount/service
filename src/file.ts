import { readFile } from "fs"

export const read_file = (path: string): Promise<string> => new Promise((resolve, reject) => {
	readFile(path, "utf8", (error, data) => {
		if(error) {
			reject(error)
		} else {
			resolve(data)
		}
	})
})

export const read_json = async (path: string) => {
	const content = await read_file(path)
	return JSON.parse(content)
}
