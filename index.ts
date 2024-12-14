import HttpServer from './src/HttpServer'
import bodyParser from './src/middlewares/bodyParser'
import json from './src/middlewares/json'
import Router from './src/Router'
import { createResponse } from './src/utils/createResponse'

const router = new Router()

router.post('/users', (req: Request) => {
	return createResponse(
		{
			user: {
				email: 'example@gmail.com',
				password: '123456798',
			},
		},
		200
	)
})

const httpServer = new HttpServer()

httpServer.addRouter(router)

httpServer.use(bodyParser)
httpServer.use(json) // Connect lastly
