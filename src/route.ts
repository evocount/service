import { Request } from "express"
import { Response } from "express"
import { NextFunction } from "express"
import { Validator } from "jsonschema"
import { Schema } from "jsonschema"

import { Context } from "./context"
import { ValidationException } from "./exception"

export abstract class Route<INPUT_T, OUTPUT_T> {
	schema: Schema

	constructor(schema: Schema) {
		this.schema = schema
	}

	abstract handle(data: INPUT_T, context: Context): Promise<OUTPUT_T>;

	/**
	 * Create an Express route out of this.
	 */
	to_express(): (request: Request, response: Response, next: NextFunction) => Promise<void> {
		const input_validator = new Validator

		return async (request: Request, response: Response, next: NextFunction) => {
			try {
				const context = new Context(request, response)

				const input = input_validator.validate(request.body, this.schema)

				if(!input.valid) {
					return next(new ValidationException(input))
				}

				const result = await this.handle(request.body, context) || ""

				response.json(result)
			} catch(error) {
				next(error)
			}
		}
	}
}
