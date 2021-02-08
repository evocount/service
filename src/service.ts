import express from "express"
import { Request } from "express"
import { Response } from "express"
import { NextFunction } from "express"
import morgan from "morgan"
import body_parser from "body-parser"

import create_logger from "./logger"
import { Logger } from "winston"
import { Settings } from "./settings"
import { Route } from "./route"
import { HTTPException } from "./exception"
import { ServerException } from "./exception"


export class Service {
	name: string
	settings: Settings
	logger: Logger

	constructor(name: string, settings: Settings) {
		this.name = name
		this.settings = settings
		this.logger = create_logger({
			level: "info"
		})
	}

	routes: Array<(request: Request, response: Response, next: NextFunction) => void> = [ ]

	add_route<INPUT_T, OUTPUT_T>(route: Route<INPUT_T, OUTPUT_T>): void {
		this.routes.push(route.to_express())
	}

	async run(): Promise<void> {
		this.logger = create_logger(this.settings.get_logger())

		const app = express()

		app.use(morgan("combined", {
			skip: (request: Request) => (request.statusCode || 200) > 400,
			stream: {
				write: (message: string) => this.logger.info(message.substring(0, message.length - 1))
			}
		}))
		app.use(morgan("combined", {
			skip: (request: Request) => (request.statusCode || 200) < 400,
			stream: {
				write: (message: string) => this.logger.error(message.substring(0, message.length - 1))
			}
		}))

		app.use(body_parser.json())

		for(const route of this.routes) {
			app.use(route)
		}

		//error handler
		app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
			this.logger.error(error)
			const http_error = error instanceof HTTPException ? error : new ServerException
			response.status(http_error.status_code())
			response.json(http_error.json())
		})

		this.logger.info(`Listening on port ${ this.settings.get_server().port }.`)
		app.listen(this.settings.get_server().port)
	}
}
