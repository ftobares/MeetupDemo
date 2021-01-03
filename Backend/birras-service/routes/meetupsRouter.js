var express = require('express');
var router = express.Router();

// Application logger
const logger = require('@config/logger.config');

// Importo Servicios
const meetupService = require('@service/meetupService')
const managerService = require('@service/meetupManagerService')

// Importo properties
const props = require('@config/properties');
const meetupsResource = props.api.resources.meetups

// Importo clases
const MeetupModel = require('@models/MeetupModel').MeetupModel

router.post(meetupsResource, async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, {tags: 'http', additionalInfo: 'Logging user='+req.body.meetup_owner});

    const meetup = new MeetupModel(
        req.body.meetup_owner,
        req.body.meetup_title,
        req.body.meetup_date,
        req.body.meetup_description,
        req.body.meetup_categories
    );

    const response = await managerService.createMeetup(meetup);
    
    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
                message: "Unexpected error."
        })
    }
});

router.get(meetupsResource, async (req, res) => {

    const ownerFilter = (req.query.owner ? req.query.owner : null);
    const categoryFilter = /*(req.query.category ? req.query.category :*/ null;

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, {tags: 'http', additionalInfo: (ownerFilter ? ownerFilter : (categoryFilter ? categoryFilter : 'No Filter')) });

    const response = await meetupService.getAllMeetups(ownerFilter, categoryFilter);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
                message: "Unexpected error."
        })
    }      
});

router.get(meetupsResource + '/:meetupId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, {tags: 'http', additionalInfo: 'Logging meetupid='+req.params.meetupId});

    const response = await meetupService.getMeetupById(req.params.meetupId);
    
    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
                message: "Unexpected error."
        })
    }       
});

router.put(meetupsResource + '/:meetupId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, {tags: 'http', additionalInfo: 'Logging meetupid='+req.params.meetupId});

    const meetup = new MeetupModel(
        null,
        req.body.meetup_title,
        req.body.meetup_date,
        req.body.meetup_description,
        req.body.meetup_categories,
        req.params.meetupId
    );    

    const response = await managerService.updateMeetup(meetup);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
                message: "Unexpected error."
        })
    }       
});

router.delete(meetupsResource + '/:meetupId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, {tags: 'http', additionalInfo: 'Logging meetupid='+req.params.meetupId});

    const response = await managerService.deleteMeetup(req.params.meetupId);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
                message: "Unexpected error."
        })
    }       
});

module.exports = router;