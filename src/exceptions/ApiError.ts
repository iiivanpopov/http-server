export default class ApiError extends Error {
	private readonly _errors: (Error | string | Record<string, any>)[]
	private readonly _statusCode: number

	public get errors(): (Error | string | Record<string, any>)[] {
		return this._errors
	}

	public get statusCode(): number {
		return this._statusCode
	}

	constructor(
		message: string = 'Internal server error',
		errors: (Error | string | Record<string, any>)[] = [],
		statusCode: number = 500
	) {
		super(message)
		this.name = 'ApiError'
		this._statusCode = statusCode

		this._errors = errors.map(err =>
			err instanceof Error
				? err
				: new Error(typeof err === 'string' ? err : JSON.stringify(err))
		)

		Object.freeze(this)
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

	static UnsupportedMediaType(
		message: string = 'Unsupported media type',
		errors: Error[] = []
	) {
		return new ApiError(message, errors, 415)
	}

	static InternalServerError(
		message: string = 'Internal server error',
		errors: Error[] = []
	) {
		return new ApiError(message, errors, 500)
	}
}
