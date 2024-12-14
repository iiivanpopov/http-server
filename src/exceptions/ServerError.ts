export default class ServerError extends Error {
	constructor(message: string) {
		super(message)
	}

	static EndpointNotFound(method: string, path: string): ServerError {
		return new ServerError(`Endpoint [${method}]:[${path}] not found.`)
	}

	static HandlerNotFound(method: string, path: string): ServerError {
		return new ServerError(
			`Handler for endpoint [${method}]:[${path}] not found.`
		)
	}

	static MethodAlreadyExists(method: string, path: string): ServerError {
		return new ServerError(`Method ${method} at ${path} already exists.`)
	}

	static InternalServerError(error: unknown): ServerError {
		if (error instanceof Error) {
			return new ServerError(error.message)
		}
		return new ServerError('Internal server error.')
	}
}
