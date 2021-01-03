// Database pool
const poolDB = require('@config/database.config')

// Logger & Properties
const logger = require('@config/logger.config')
const props = require('@config/properties')
const schema = props.databaseSchema

// Import dependencies
const ResponseModel = require('@models/ResponseModel').ResponseModel
const CountryModel = require('@models/CountryModel').CountryModel
const StateModel = require('@models/StateModel').StateModel
const CityModel = require('@models/CityModel').CityModel

const getCountries = async () => {
        const client = await poolDB.connect();
        let resp = new ResponseModel();

        try{
                const res = await client.query('SELECT  country_id, ' +
                                               '        name ' +
                                               'FROM '+schema+'.countries'                                               
                                              );
                if(res.rows.length > 0){
                    logger.warn("Countries fetched");
                    let countriesArray = res.rows.map((country) => {
                        return new CountryModel(
                            country.country_id,
                            country.name
                        );
                    });
                    resp.code = 200
                    resp.message = countriesArray
                }else{
                    logger.warn("Error fetching countries")
                    resp.code = 200
                    resp.message = []
                }
        }catch(exception){
                resp.code = 500,
                resp.message = 'Unexpected error: '+exception                
                    
                return resp;
        } finally {
                client.release();
        }
        return resp;
}

const getStates = async (countryId) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try{
            const res = await client.query('SELECT  state_id, ' +
                                           '        name ' +
                                           'FROM '+schema+'.states '+
                                           'WHERE country_id = $1',
                                           [
                                            countryId
                                           ]
                                          );
            if(res.rows.length > 0){
                logger.warn("States fetched");
                let statesArray = res.rows.map((state) => {
                    return new StateModel(
                        state.state_id,
                        state.name,
                        countryId
                    );
                });
                resp.code = 200
                resp.message = statesArray
            }else{
                logger.warn("Error fetching states")
                resp.code = 200
                resp.message = []
            }
    }catch(exception){
            resp.code = 500,
            resp.message = 'Unexpected error: '+exception                
                
            return resp;
    } finally {
            client.release();
    }
    return resp;
}

const getCities = async (stateId) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try{
            const res = await client.query('SELECT  city_id, ' +
                                           '        name, ' +
                                           '        latitud, ' +
                                           '        longuitud ' +
                                           'FROM '+schema+'.cities '+
                                           'WHERE state_id = $1',
                                           [
                                            stateId
                                           ]
                                          );
            if(res.rows.length > 0){
                logger.warn("Cities fetched");
                let citiesArray = res.rows.map((city) => {
                    return new CityModel(
                        city.city_id,
                        city.name,
                        stateId,
                        city.latitud,
                        city.longuitud
                    );
                });
                resp.code = 200
                resp.message = citiesArray
            }else{
                logger.warn("Error fetching Cities")
                resp.code = 200
                resp.message = []
            }
    }catch(exception){
            resp.code = 500,
            resp.message = 'Unexpected error: '+exception                
                
            return resp;
    } finally {
            client.release();
    }
    return resp;
}

const getCity = async (cityId) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try{
            const res = await client.query('SELECT  city_id, ' +
                                           '        name, ' +
                                           '        state_id, ' +
                                           '        latitud, ' +
                                           '        longuitud ' +
                                           'FROM '+schema+'.cities '+
                                           'WHERE city_id = $1',
                                           [
                                            cityId
                                           ]
                                          );
            if(res.rows.length > 0){
                logger.warn("City fetched"); 
                resp.code = 200
                resp.message = new CityModel(
                    res.rows[0].city_id,
                    res.rows[0].name,
                    res.rows[0].state_id,
                    res.rows[0].latitud,
                    res.rows[0].longuitud
                );
            }else{
                logger.warn("Error fetching City")
                resp.code = 200
                resp.message = []
            }
    }catch(exception){
            resp.code = 500,
            resp.message = 'Unexpected error: '+exception                
                
            return resp;
    } finally {
            client.release();
    }
    return resp;
}

module.exports = {
    getCountries,
    getStates,
    getCities,
    getCity
};