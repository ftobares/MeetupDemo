var express = require('express');
var router = express.Router();

// Application logger
const logger = require('@config/logger.config');

// Importo Servicios
const categoriesService = require('@service/categoriesService')

// Importo properties
const props = require('@config/properties');
const categoriesResource = props.api.resources.categories

router.get(categoriesResource, async (req, res) => {

        logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Fetching categories' });

        const response = await categoriesService.getCategories();

        if (response && response.code) {
                return res.status(response.code).send(response.message);
        } else {
                return res.status(500).send({
                        message: "Unexpected error."
                })
        }
});

module.exports = router;