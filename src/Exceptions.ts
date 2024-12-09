export default class Exceptions {
	public static notFoundResponse(method: string, path: string): Response {
		const message = `Route [${method}] at [${path}] not found.`
		return new Response(message, { status: 404 })
	}

	public static methodNotAllowedResponse(
		method: string,
		path: string
	): Response {
		const message = `Method [${method}] not allowed at [${path}].`
		return new Response(message, { status: 405 })
	}

	public static internalServerErrorResponse(error: unknown): Response {
		const message =
			error instanceof Error ? error.message : 'Internal Server Error'
		console.error('Internal Server Error:', error)
		return new Response(message, { status: 500 })
	}
}
