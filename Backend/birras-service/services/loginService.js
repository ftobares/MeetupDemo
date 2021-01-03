'use strict'

// Importo Pool de base de datos
const poolDB = require('@config/database.config')

// Importo módulo de JWT y CryptoJS
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")

// Importo el logger
const logger = require('@config/logger.config')

// Importo properties
const props = require('@config/properties')
const schema = props.databaseSchema

// Importo clases
const ResponseModel = require('@models/responseModel').ResponseModel

// Tomamos la clave secreta para autenticación JWT
const tokenSecretKey = props.jwt.secretKey
const expirationTime = props.jwt.tokenExpirationTime
const encryptSecret = props.encryptSecret

const authenticate = async (user, pass) => {
    
    const client = await poolDB.connect();
    let resp = new ResponseModel()
    
    try{
        logger.info("Looking for user&pass in DB. user="+user)
        const res = await client.query('SELECT user_pass '+
                                     'FROM '+schema+'.users '+
                                     'WHERE user_email = $1::text ', 
                                     [
                                        user
                                     ]
                                    );
        if(res.rows.length > 0){

            let decrypted = CryptoJS.AES.decrypt(res.rows[0].user_pass, encryptSecret);
            
            if(pass === decrypted.toString(CryptoJS.enc.Utf8)){
                resp.code = 200
                resp.message = 'Login Success'
            }else{
                logger.warn("Login failed; Invalid user ID or password. user="+user);
                resp.code = 401
                resp.message = 'Login failed; Invalid user ID or password.'
            }
                    
        }else{
            logger.warn("Login failed; Invalid user ID or password. user="+user),
            resp.code = 401
            resp.message = 'Login failed; Invalid user ID or password.'
        }
    }catch(exception){       
        resp.code = 500
        resp.message = 'Unexpected error: '+exception
    } finally {       
        client.release();    
    }
    return resp;
}

const generateToken = async (user) => {
    try{
		const payload = {
			check: true,
			email: user
		}
        logger.info("Generating token")
		const token = jwt.sign(payload, tokenSecretKey, {
			expiresIn: expirationTime
        });
		return token;
	} catch(ex){
		logger.error(ex)
		return false
	}
}

module.exports = {
    authenticate,
    generateToken
};