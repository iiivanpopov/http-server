export default class ApiError extends Error {
	private _errors: Error[]
	private _statusCode: number

	public get errors(): Error[] {
		return this._errors
	}

	public get statusCode(): number {
		return this._statusCode
	}

	constructor(message: string, errors: Error[], statusCode: number) {
		super(message)
		this._statusCode = statusCode
		this._errors = errors
	}

	static NotFound(message: string = 'Not found', errors: Error[] = []) {
		return new ApiError(message, errors, 404)
	}

	static BadRequest(message: string = 'Bad request', errors: Error[] = []) {
		return new ApiError(message, errors, 400)
	}

	static Unauthorized(message: string = 'Unauthorized', errors: Error[] = []) {
		return new ApiError(message, errors, 401)
	}

	static Forbidden(message: string = 'Forbidden', errors: Error[] = []) {
		return new ApiError(message, errors, 403)
	}

	static UnsupportedContentType(contentType: string, errors: Error[] = []) {
		return new ApiError(
			`Unsupported Content-Type: ${contentType}.`,
			errors,
			415
		)
	}
}
