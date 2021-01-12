import { Request } from "express"
import { Response } from "express"

export class Context {
	request: Request
	response: Response

	constructor(request: Request, response: Response) {
		this.request = request
		this.response = response
	}
}
