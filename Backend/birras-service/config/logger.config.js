'use strict'

const rTracer = require('cls-rtracer');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const props = require('@config/properties');

// Defino configuracion
const rTracerFormat = printf((info) => {
    const rid = rTracer.id()    
	return rid
	? `${info.level} ${info.timestamp} [request-id:${rid}]: ${JSON.stringify(info.message)}`
	: `${info.level} ${info.timestamp} [request-id:null]: ${info.message}`
})

const logger = createLogger({
	format: combine(
	timestamp(),
	rTracerFormat
	),
	transports: [
		new transports.Console({colorize: true})
	]
})

module.exports = logger