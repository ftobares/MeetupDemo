'use strict'

// Alias
require('module-alias/register')

// Basic
const express = require('express');
const bodyParser = require('body-parser');
const rTracer = require('cls-rtracer');

// Security
const helmet = require('helmet');
const cors = require('cors');

// Project Config
const logger = require('@config/logger.config')
const props = require('@config/properties');
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

// Init
const app = express();

// Server config
const port = props.serverPort
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use((req, res, next) => {
// 	res.setHeader(props.headers.methods.name, props.headers.methods.value);
// 	res.setHeader(props.headers.headers.name, props.headers.headers.value);
// 	res.setHeader(props.headers.origin.name, props.headers.origin.value);
// 	res.setHeader(props.headers.credentials.name, props.headers.credentials.value);
// 	next();
// })

// Logger
const morgan = require('morgan');
app.use(morgan('combined', { 
	skip: function (req, res) { return req.originalUrl == props.healthCheckUri} 
}));

// Middleware
const authenticator = require('./middleware');
app.use((req, res, next) => authenticator(req, res, next));
app.use(rTracer.expressMiddleware());

// Resources
const authRouter = require('@routes/authenticationRouter')
const meetupsRouter = require('@routes/meetupsRouter')
const usersRouter = require('@routes/usersRouter')
const categoriesRouter = require('@routes/categoriesRouter');
const geolocationRouter = require('@routes/geolocationRouter');

const mainResource = props.api.mainResource + props.api.version;
app.use(mainResource, authRouter);
app.use(mainResource, meetupsRouter);
app.use(mainResource, usersRouter);
app.use(mainResource, categoriesRouter);
app.use(mainResource, geolocationRouter);

// Database
const dbConfig = require('@config/database.config');

logger.info("Connecting to Database...");
dbConfig.connect((err, client, release) => {
	if (err) {
		return logger.error('Error connecting to Database'+ err.stack)
	}
	client.query('SELECT NOW()', (err, result) => {
		release()
		if (err) {
			return logger.error('Unexpected error in Database testing query'+ err.stack)
		}
		logger.info('Connection to Database Success.')

		// Server start up
		app.listen(port, () => {
			logger.info('Server is up at port: '+ port)
		});
		app.use(props.healthCheckUri, require('express-healthcheck')())
	})
});