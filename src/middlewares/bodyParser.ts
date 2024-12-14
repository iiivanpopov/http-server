import { validateHeaderValue } from 'http'
import ApiError from '../exceptions/ApiError'

export default async (req: Request) => {
	const contentType = req.headers.get('content-type')

	if (!contentType) {
		return
	}

	try {
		validateHeaderValue('content-type', contentType)
	} catch (error) {
		throw ApiError.UnsupportedMediaType(contentType)
	}

	let body: any
	if (contentType.includes('application/json')) {
		body = await req.json()
	} else if (contentType.includes('text/plain')) {
		body = await req.text()
	} else {
		throw ApiError.UnsupportedMediaType()
	}

	Object.defineProperty(req, 'body', {
		value: body,
		writable: false,
	})
}
