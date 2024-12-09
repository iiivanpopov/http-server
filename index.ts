import HttpServer from './src/HttpServer'
import Router from './src/Router'

const router = new Router()

router.get('/users', (req: Request): Response => {
	return new Response(
		JSON.stringify({
			users: [
				{ id: 1, username: 'Ivan' },
				{ id: 2, username: 'Popov' },
			],
		})
	)
})

const httpServer = new HttpServer(3000)
httpServer.addRouter(router)
