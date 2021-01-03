const jwt = require('jsonwebtoken');
const logger = require('@config/logger.config');
const props = require('@config/properties');

const authenticator = (req, res, next) => {
    
	let auth = props.api.mainResource 
		+ props.api.version 
        + props.api.resources.auth
    let usersResource = props.api.mainResource
        + props.api.version
        + props.api.resources.users
    let categoriesResource = props.api.mainResource
        + props.api.version
        + props.api.resources.categories
    let countriesResource = props.api.mainResource
        + props.api.version
        + props.api.resources.countries
    let statesResource = props.api.mainResource
        + props.api.version
        + props.api.resources.states
    let citiesResource = props.api.mainResource
        + props.api.version
        + props.api.resources.cities
	let healthcheck = props.healthCheckUri
	if(req.url != auth
        && !(req.url === usersResource && req.method === props.methods.POST)
        && req.url != categoriesResource
        && !req.url.includes(countriesResource)
        && !req.url.includes(statesResource)
        && !req.url.includes(citiesResource)
		&& req.url != healthcheck){
		const token = req.headers['authorization']
		const secret_key = props.jwt.secretKey
		if (token) {
			logger.info("Token recibido: " + token.replace("Bearer ",""))
			jwt.verify(token.replace("Bearer ",""), secret_key, (err, decoded) => {      
				if (err) {
					return res.status(403).send({
						mensaje: 'The client does not have the necessary permissions for the requested content.' 
					})    
				} else {
					req.decoded = decoded
				}
			})
		} else {
			return res.status(401).send({ 
				mensaje: 'Login is required to obtain the requested response.' 
			})
		}
	}
	next()
}

module.exports = authenticator