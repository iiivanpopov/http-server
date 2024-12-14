import ApiError from './exceptions/ApiError'
import type { Callback, Endpoints, Method } from './types'

export default class Router {
	private _endpoints: Endpoints = {}

	get endpoints() {
		return this._endpoints
	}

	private _request(method: Method, path: string, handler: Callback) {
		if (!this._endpoints[path]) {
			this._endpoints[path] = {}
		}
		const endpoint = this._endpoints[path]

		if (endpoint[method]) {
			throw ApiError.InternalServerError(
				`Method ${method} at ${path} already exists`
			)
		}

		endpoint[method] = handler
	}

	get(path: string, handler: Callback) {
		this._request('GET', path, handler)
	}

	post(path: string, handler: Callback) {
		this._request('POST', path, handler)
	}

	delete(path: string, handler: Callback) {
		this._request('DELETE', path, handler)
	}

	put(path: string, handler: Callback) {
		this._request('PUT', path, handler)
	}

	patch(path: string, handler: Callback) {
		this._request('PATCH', path, handler)
	}
}
