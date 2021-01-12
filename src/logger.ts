import winston from "winston"
import { Logger } from "winston"

import { LoggerSettings } from "./settings"

export default (settings: LoggerSettings): Logger => winston.createLogger({
	level: settings.level,
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			)
		})
	]
})
