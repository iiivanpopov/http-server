export default async (req: Request, res: Response) => {
	res?.headers.append('Content-type', 'application/json')
}
