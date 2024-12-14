import ApiError from '../exceptions/ApiError'

export default async (req: Request, res: Response) => {
	const contentType = req.headers.get('content-type')

	if (!contentType) {
		return
	}

	let body: any

	if (contentType.includes('application/json')) {
		body = await req.json()
	} else if (contentType.includes('text/plain')) {
		body = await req.text()
	} else {
		return ApiError.UnsupportedContentType(contentType)
	}

	Object.defineProperty(req, 'body', {
		value: body,
		writable: false,
	})
}
