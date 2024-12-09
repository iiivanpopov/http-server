import type { Callback, Endpoints } from './types'

export default class Router {
	endpoints: Endpoints = {}

	constructor() {
		this.endpoints = {}
	}

	request(method: string = 'GET', path: string, handler: Callback) {
		if (!this.endpoints[path]) {
			this.endpoints[path] = {}
		}
		const endpoint = this.endpoints[path]

		if (endpoint[method]) {
			throw new Error(`[${method}] at ${path} already exists.`)
		}

		endpoint[method] = handler
	}

	get(path: string, handler: Callback) {
		this.request('GET', path, handler)
	}

	post(path: string, handler: Callback) {
		this.request('POST', path, handler)
	}

	delete(path: string, handler: Callback) {
		this.request('DELETE', path, handler)
	}

	put(path: string, handler: Callback) {
		this.request('PUT', path, handler)
	}

	patch(path: string, handler: Callback) {
		this.request('PATCH', path, handler)
	}
}
