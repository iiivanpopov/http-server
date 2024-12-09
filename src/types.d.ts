export type Callback = (req: Request) => Response | Promise<Response>
export type Endpoint = Record<string, Callback>
export interface Endpoints {
	[path: string]: Endpoint
}
