import type ApiError from './exceptions/ApiError'

export type Callback = (
	req: Request
) =>
	| Promise<Response>
	| Response
	| Promise<Error>
	| Promise<ApiError>
	| Error
	| ApiError

export type Middleware = (
	req: Request,
	res: Response
) =>
	| Promise<Response>
	| Response
	| void
	| Promise<void>
	| Promise<Error>
	| Promise<ApiError>
	| Error
	| ApiError

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type Endpoint = Record<string, Callback>
export interface Endpoints {
	[path: string]: Endpoint
}
