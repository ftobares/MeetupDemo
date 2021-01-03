'use strict'

module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'BIRRAS_MEETUP_QA',
    serverHost: process.env.HOST || 'localhost',
	serverPort: process.env.PORT || 3701,	
	jwt:{
		secretKey: '4#7_8D68dfbcdf0851#14426f1f11c44_6#4a4F0103203!07ea$905a8ff2A0e08',
		tokenExpirationTime: 86400
	},
	encryptSecret: '6fF21e809$857aea24A4f09e2f!21c0d_4752e69c4766888f4_6cb6$3e6d7ef1',
	contentType: "application/json",
	headers: {
		origin:{
			name: 'Access-Control-Allow-Origin',
			value: '*'
		},
		methods:{
			name: 'Access-Control-Allow-Methods',
			value: 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
		},
		headers: {
			name: 'Access-Control-Allow-Headers',
			value: 'X-Requested-With, Content-type, Accept, X-Access-Token, X-Key, Authorization'
		},
		credentials:{
			name: 'Access-Control-Allow-Credentials',
			value: false
		}
	},
	api: {
		mainResource: '/api/',
		version: 'v1',
		resources: {
			meetups: '/meetups',
			users: '/users',
            auth: '/auth',
            categories: '/categories',
            countries: '/countries',
            states: '/states',
            cities: '/cities'
		}
	},
	logs: {
		requests: {
			dirName: 'log',
			fileName: 'requests.log'
		}
	},
	methods:{
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE'
	},
	healthCheckUri: '/healthcheck',	
	databaseSchema: process.env.SCHEMA_DB || 'public'
}