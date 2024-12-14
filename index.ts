import HttpServer from './src/HttpServer'
import bodyParser from './src/middlewares/bodyParser'
import json from './src/middlewares/json'
import Router from './src/Router'

const router = new Router()

router.post('/users', (req: Request) => {
	return {
		users: [
			{ id: 1, username: 'Ivan' },
			{ id: 2, username: 'Popov' },
		],
	}
})

const httpServer = new HttpServer()

httpServer.addRouter(router)
httpServer.use(json)
httpServer.use(bodyParser)
httpServer.use(req => console.log(req.body))
