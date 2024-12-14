import ApiError from '../exceptions/ApiError'

/**
 * A utility class for logging messages and errors.
 *
 * This class provides methods to log information and error messages to the console,
 * formatting the messages with timestamps and severity levels.
 */
export default class Logger {
	private _getDate(date: Date = new Date()): string {
		const formattedDate = `[${date.toISOString()}]`
		return formattedDate
	}

	/**
	 * Logs an informational message to the console.
	 *
	 * @param {unknown} message - The message to log.
	 * @example
	 * // Logs an informational message
	 * logger.log('User successfully logged in.');
	 */
	log(message: unknown): void {
		console.log(`${this._getDate()}: [INFO] ${message}`)
	}

	/**
	 * Logs an error message to the console. Differentiates between `ApiError` and generic `Error` objects.
	 *
	 * @param {unknown} error - The error to log. Can be an `ApiError`, a standard `Error`, or any other unknown object.
	 * @example
	 * // Logs an `ApiError` instance
	 * logger.error(new ApiError('User not found', 404));
	 *
	 * @example
	 * // Logs a generic error message
	 * logger.error(new Error('Something went wrong.'));
	 */
	error(error: unknown): void {
		if (error instanceof ApiError) {
			console.log(
				`${this._getDate()}: [ERROR] ${error.message} - ${
					error.statusCode
				}\nStack: ${error.stack}`
			)
		} else if (error instanceof Error) {
			console.log(
				`${this._getDate()}: [ERROR] ${error.message}\nStack: ${error.stack}`
			)
		} else {
			console.log(`${this._getDate()}: [ERROR] ${error}`)
		}
	}
}

/**
 * An instance of the `Logger` class for direct use.
 */
export const logger = new Logger()
