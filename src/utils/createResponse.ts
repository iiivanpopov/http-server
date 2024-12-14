/**
 * Creates an HTTP `Response` object with a given body and status, options, or an existing `Response` object.
 *
 * This utility function simplifies creating `Response` objects with a JSON-encoded body or returning an existing `Response`.
 *
 * @param {any | Response} body - The body of the response to be JSON-stringified, or an existing `Response` object.
 * @param {number | ResponseInit} [arg] - Either a status code (number), a `ResponseInit` object to configure the response, or omitted if `body` is a `Response`.
 * @returns {Response} - A `Response` object with the provided body and configuration, or the input `Response` object if one was provided.
 *
 * @example
 * // Create a response with a body and status code
 * const res = createResponse({ message: "Success" }, 200);
 *
 * @example
 * // Create a response with a body and custom headers
 * const res = createResponse({ error: "Not Found" }, { status: 404, headers: { "Content-Type": "application/json" } });
 *
 * @example
 * // Return an existing Response object
 * const existingResponse = new Response("Hello");
 * const res = createResponse(existingResponse);
 */
export function createResponse(
	body: any | Response,
	arg?: number | ResponseInit
): Response {
	if (body instanceof Response) {
		return body
	}

	if (typeof arg === 'number') {
		return new Response(JSON.stringify(body), { status: arg })
	} else {
		return new Response(JSON.stringify(body), { ...arg })
	}
}
