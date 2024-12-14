import ApiError from '../exceptions/ApiError'
import ServerError from '../exceptions/ServerError'

export default class Logger {
	private _getDate(date: Date = new Date()) {
		const formattedDate = `[${date.toISOString()}]`
		return formattedDate
	}

	log(data: unknown) {
		console.log(`${this._getDate()}: [INFO] ${data}`)
	}
	error(error: unknown) {
		if (error instanceof ApiError) {
			console.log(`${this._getDate()}: [ERROR] ${error}`)
		} else if (error instanceof ServerError) {
			console.log(`${this._getDate()}: [ERROR] ${error.message}`)
		} else if (error instanceof Error) {
			console.log(
				`${this._getDate()}: [ERROR] ${error.message}\nStack: ${error.stack}`
			)
		} else {
			console.log(`${this._getDate()}: [ERROR] ${error}`)
		}
	}
}

export const logger = new Logger()
