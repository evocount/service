import express from "express"
import { Request } from "express"
import { Response } from "express"
import { NextFunction } from "express"
import morgan from "morgan"
import body_parser from "body-parser"

import create_logger from "./logger"
import { Settings } from "./settings"
import { load as load_settings } from "./settings"
import { Route } from "./route"
import { HTTPException } from "./exception"
import { ServerException } from "./exception"


export class Service {
	name: string

	constructor(name: string) {
		this.name = name
	}

	routes: Array<(request: Request, response: Response, next: NextFunction) => void> = [ ]

	add_route<INPUT_T, OUTPUT_T>(route: Route<INPUT_T, OUTPUT_T>): void {
		this.routes.push(route.to_express())
	}

	async run(): Promise<void> {
		const settings = await load_settings(this.name)
		const logger = create_logger(settings.get_logger())

		const app = express()

		app.use(morgan("combined", {
			skip: (request: Request) => (request.statusCode || 200) > 400,
			stream: {
				write: (message: string) => logger.info(message)
			}
		}))
		app.use(morgan("combined", {
			skip: (request: Request) => (request.statusCode || 200) < 400,
			stream: {
				write: (message: string) => logger.error(message)
			}
		}))

		app.use(body_parser.json())

		for(const route of this.routes) {
			app.use(route)
		}

		//error handler
		app.use((error: Error, request: Request, response: Response) => {
			logger.error(error)
			const http_error = error instanceof HTTPException ? error : new ServerException
			response.status(http_error.status_code())
			response.json(http_error.json())
		})

		app.listen(settings.get_server().port)
	}
}
