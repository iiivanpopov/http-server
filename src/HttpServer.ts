import type { Server } from 'bun'
import ServerError from './exceptions/ServerError'
import type Router from './Router'
import type { Endpoint, Middleware } from './types'
import { logger } from './utils/Logger'

export default class HttpServer {
	private _port: number
	private _httpServer: Server
	private _routes: Record<string, Endpoint> = {}
	private _middlewares: Middleware[] = []

	get port() {
		return this._port
	}

	constructor(port: number = 3000) {
		this._port = port
		this._httpServer = this._runServer()
	}

	addRouter(router: Router) {
		Object.keys(router.endpoints).forEach(path => {
			const endpoint = router.endpoints[path]
			this._routes[path] = endpoint
		})
	}

	private _handleRequest = async (req: Request): Promise<Response> => {
		try {
			if (Object.keys(this._routes).length == 0) {
				throw new Error('No routes are active.')
			}

			const url = new URL(req.url)
			const path = url.pathname

			const endpoint = this._routes[path]
			if (!endpoint) {
				throw ServerError.EndpointNotFound(req.method, path)
			}

			const handler = endpoint[req.method]
			if (!handler) {
				throw ServerError.HandlerNotFound(req.method, path)
			}

			const responseBody = await handler(req)

			let response = new Response(JSON.stringify(responseBody))

			for (const middleware of this._middlewares) {
				const middlewareResponse = await middleware(req, response)

				if (middlewareResponse) {
					response = new Response(middlewareResponse)
				}
			}

			return response
		} catch (error) {
			throw ServerError.InternalServerError(error)
		}
	}

	use(middleware: Middleware) {
		this._middlewares.push(middleware)
	}

	close() {
		this._httpServer.stop()
	}

	private _runServer = () => {
		const instance = this

		const server = Bun.serve({
			fetch(req: Request): Response | Promise<Response> {
				return instance._handleRequest(req)
			},
			port: instance.port,
		})

		logger.log(`Started HTTP server at ${server.url}`)

		return server
	}
}
