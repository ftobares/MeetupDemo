var express = require('express');
var router = express.Router();

// Application logger
const logger = require('@config/logger.config');

// Importo Servicios
const loginService = require('@service/loginService')

// Importo properties
const props = require('@config/properties')
const authResource = props.api.resources.auth

// Importo clases
const ResponseModel = require('@models/ResponseModel').ResponseModel

router.post(authResource, async (req, res) => {
   
    const user = req.body.user
    const password = req.body.pass
    let token;
    
    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, {tags: 'http', additionalInfo: 'Logging user='+user});

    const response = await loginService.authenticate(user, password);

    if(response && response.code !== 200){
        return res.status(response.code).send({
            message: response.message
        })        
    }else if(response && response.code === 200){
        token = await loginService.generateToken(user)
        if(!token){
            return res.status(500).send({
                message: "Unexpected error."
            })
        }
        return res.status(response.code).send({
            message: response.message,
            token: token
        })
    }else{
        return res.status(500).send({
            message: "Unexpected error."
        })
    }

});

module.exports = router;
