export type Callback = (req: Request) => Response | Promise<Response>
export type Endpoint = Record<string, Callback>
export type Middleware = (
	req: Request,
	res: Response | null
) => void | Promise<void>

export interface Endpoints {
	[path: string]: Endpoint
}
