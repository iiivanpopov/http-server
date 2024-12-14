export type Callback = (req: Request) => Promise<any> | any
export type Middleware = (
	req: Request,
	res: Response
) => Promise<any> | Promise<void> | any | void
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type Endpoint = Record<string, Callback>
export interface Endpoints {
	[path: string]: Endpoint
}
