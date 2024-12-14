import type { Server } from 'bun'
import ApiError from './exceptions/ApiError'
import type Router from './Router'
import type { Endpoint, Middleware } from './types'
import { createResponse } from './utils/createResponse'
import { logger } from './utils/Logger'

/**
 * A class representing an HTTP server.
 *
 * This class handles setting up a Bun server, adding routers with endpoints, and managing middleware.
 * It processes requests, manages routes and middlewares, and provides error handling.
 */
export default class HttpServer {
	private _port: number
	private _httpServer: Server
	private _routes: Record<string, Endpoint> = {}
	private _middlewares: Middleware[] = []

	/**
	 * The port number on which the server listens.
	 * @readonly
	 * @type {number}
	 */
	get port() {
		return this._port
	}

	/**
	 * Constructs an instance of the HttpServer class.
	 *
	 * @param {number} [port=3000] - The port number on which the server will listen. Defaults to 3000.
	 */
	constructor(port: number = 3000) {
		this._port = port
		this._httpServer = this._createServer()
	}

	/**
	 * Adds a router with its endpoints to the server.
	 *
	 * @param {Router} router - An object representing the router, containing endpoints.
	 * @throws {Error} Throws an error if the router is invalid (does not contain endpoints).
	 * @example
	 * // Add a router with its endpoints to the HTTP server
	 * server.addRouter(myRouter);
	 */
	addRouter(router: Router): void {
		if (!router || !router.endpoints) {
			throw new Error('Invalid router: Router must contain endpoints.')
		}
		Object.keys(router.endpoints).forEach(path => {
			const endpoint = router.endpoints[path]
			if (typeof endpoint !== 'object' || !endpoint) {
				throw new Error(`Invalid endpoint at path: ${path}`)
			}
			this._routes[path] = endpoint
		})
	}

	/**
	 * Registers a middleware function for processing requests.
	 *
	 * @param {Middleware} middleware - A function that takes a request and a response and returns a modified response or an error.
	 * @example
	 * // Use a custom middleware to add some response headers
	 * server.use(async (req: Request, res: Response) => {
	 * 	res?.headers.append('Content-type', 'application/json');
	 * });
	 * @example
	 * // Use a custom middleware to return a new response
	 * server.use(async (req: Request, res: Response) => {
	 * 	return createResponse({"foo": "bar"}, 200);
	 * });
	 */
	use(middleware: Middleware): void {
		this._middlewares.push(middleware)
	}

	/**
	 * Stops the HTTP server.
	 *
	 * @example
	 * // Close the server
	 * server.close();
	 */
	close(): void {
		this._httpServer.stop()
	}

	private _handleRequest = async (req: Request): Promise<Response> => {
		try {
			const url = new URL(req.url)
			const path = url.pathname

			const endpoint = this._routes[path]
			if (!endpoint) {
				throw ApiError.InternalServerError(
					`Endpoint [${req.method}]:[${path}] not found`
				)
			}

			const handler = endpoint[req.method]
			if (!handler) {
				throw ApiError.InternalServerError(
					`Handler for endpoint [${req.method}]:[${path}] not found`
				)
			}

			let response = await handler(req)
			if (response instanceof Error) {
				throw response
			}

			for (const middleware of this._middlewares) {
				const middlewareResponse = await middleware(req, response)
				if (middlewareResponse instanceof Error) {
					throw middlewareResponse
				}

				if (middlewareResponse) {
					response = middlewareResponse
				}
			}

			return response
		} catch (error) {
			logger.error(error)
			if (error instanceof ApiError) {
				return createResponse({ message: error.message }, error.statusCode)
			}

			return createResponse({ message: 'Unexpected error' }, 500)
		}
	}

	private _createServer = () => {
		const server = Bun.serve({
			fetch: (req: Request) => this._handleRequest(req),
			port: this._port,
		})

		logger.log(`Created HTTP server at ${server.url}`)
		return server
	}
}
