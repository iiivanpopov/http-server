import type { Server } from 'bun'
import Exceptions from './Exceptions'
import type Router from './Router'
import type { Endpoint, Middleware } from './types'
import { normalizePath } from './utils/index'

export default class HttpServer {
	private _httpServer: Server
	port: number
	private _routes: Record<string, Endpoint>
	private middlewares: Middleware[]

	constructor(port: number) {
		this.port = port
		this._routes = {}
		this._httpServer = this._createServer()
		this.middlewares = []
	}

	addRouter(router: Router) {
		Object.keys(router.endpoints).forEach(path => {
			const endpoint = router.endpoints[path]
			this._routes[path] = endpoint
		})
	}

	use(middleware: Middleware) {
		this.middlewares.push(middleware)
	}

	async handleRequest(req: Request): Promise<Response> {
		try {
			if (Object.keys(this._routes).length === 0) {
				throw new Error('No routes are active.')
			}

			const url = new URL(req.url)
			const path = normalizePath(url.pathname)
			const endpoint = this._routes[path]

			if (!endpoint) {
				return Exceptions.notFoundResponse(req.method, path)
			}

			const handler = endpoint[req.method]
			if (!handler) {
				return Exceptions.methodNotAllowedResponse(req.method, path)
			}

			for (const middleware of this.middlewares) {
				await middleware(req, null)
			}

			const response = await handler(req)
			response?.headers.append('Content-type', 'application/json')

			return response
		} catch (error) {
			return Exceptions.internalServerErrorResponse(error)
		}
	}

	private _createServer() {
		const instance = this
		const server = Bun.serve({
			fetch(req: Request): Promise<Response> {
				return instance.handleRequest(req)
			},
			port: instance.port,
		})
		console.log(`Created Http server at ${instance.port}`)
		return server
	}
}
