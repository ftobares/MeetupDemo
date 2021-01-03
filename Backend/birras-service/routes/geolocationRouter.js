var express = require('express');
var router = express.Router();

// Application logger
const logger = require('@config/logger.config');

// Importo Servicios
const geoLocationService = require('@service/geoLocationService')

// Importo properties
const props = require('@config/properties');
const countriesResource = props.api.resources.countries
const statesResource = props.api.resources.states
const citiesResource = props.api.resources.cities

router.get(countriesResource, async (req, res) => {

        logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Fetching countries' });

        const response = await geoLocationService.getCountries();

        if (response && response.code) {
                return res.status(response.code).send(response.message);
        } else {
                return res.status(500).send({
                        message: "Unexpected error."
                })
        }
});

router.get(statesResource + '/countries/:countryId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Fetching states for country:'+req.params.countryId });

    const response = await geoLocationService.getStates(req.params.countryId);

    if (response && response.code) {
            return res.status(response.code).send(response.message);
    } else {
            return res.status(500).send({
                    message: "Unexpected error."
            })
    }
});

router.get(citiesResource + '/states/:stateId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Fetching cities for state:'+req.params.stateId });

    const response = await geoLocationService.getCities(req.params.stateId);

    if (response && response.code) {
            return res.status(response.code).send(response.message);
    } else {
            return res.status(500).send({
                    message: "Unexpected error."
            })
    }
});

router.get(citiesResource + '/:cityId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Fetching city:'+req.params.cityId });

    const response = await geoLocationService.getCity(req.params.cityId);

    if (response && response.code) {
            return res.status(response.code).send(response.message);
    } else {
            return res.status(500).send({
                    message: "Unexpected error."
            })
    }
});

module.exports = router;