import { ValidatorResult } from "jsonschema"

export interface DescriptionSchema {
	message: string
}

export interface HTTPExceptionJSON extends DescriptionSchema {
	status_code: number
}

export interface ErrorDescriptionSchema extends DescriptionSchema {
	errors: Array<string>
}


export abstract class HTTPException {
	abstract status_code(): number
	abstract description(): DescriptionSchema

	json(): HTTPExceptionJSON  {
		return {
			status_code: this.status_code(),
			...this.description()
		}
	}

	toString(): string {
		return `HTTPException ${ this.status_code() } - ${ this.description().message }`
	}
}

export class ServerException extends HTTPException {
	status_code(): number {
		return 500
	}

	description(): DescriptionSchema {
		return {
			message:"Internal server error."
		}
	}
}

export class ClientException extends HTTPException {
	private _status_code: number
	message: string

	constructor(message: string, status_code = 400) {
		super()
		this.message = message
		this._status_code = status_code
	}

	status_code(): number {
		return this._status_code
	}

	description(): DescriptionSchema {
		return {
			message: this.message
		}
	}
}

export class ValidationException extends ClientException {
	result: ValidatorResult

	constructor(result: ValidatorResult) {
		super("Validation Error")
		this.result = result
	}

	description(): ErrorDescriptionSchema {
		return {
			...super.description(),
			errors: this.result.errors.map(error => error.toString())
		}
	}
}
