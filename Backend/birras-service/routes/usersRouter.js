var express = require('express');
var router = express.Router();

// Application logger
const logger = require('@config/logger.config');

// Importo Servicios
const userService = require('@service/userService');

// Importo properties
const props = require('@config/properties');
const usersResource = props.api.resources.users

// Importo clases
const UserModel = require('@models/UserModel').UserModel

router.post(usersResource, async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging user=' + req.body.user_email });

    let user = new UserModel(
        req.body.user_email,
        req.body.user_pass,
        req.body.user_name,
        req.body.user_surname,
        req.body.user_country,
        req.body.user_city
    );

    const response = await userService.createUser(user);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        })
    }
});

router.get(usersResource + '/:userEmail', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging user=' + req.params.userEmail });

    const user = new UserModel(req.params.userEmail);

    const response = await userService.getUser(user);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        })
    }
});

router.get(usersResource + '/:userEmail' + '/meetups', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging user=' + req.params.userEmail });

    const user = new UserModel(req.params.userEmail);

    const response = await userService.getMeetupsRegisteredByUser(user);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        })
    }
});

router.put(usersResource + '/:userEmail', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging user=' + req.params.userEmail });

    const user = new UserModel(
        req.params.userEmail,
        null,
        req.body.user_name,
        req.body.user_surname,
        req.body.user_country,
        req.body.user_city
    );

    const response = await userService.updateUser(user);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        })
    }
});

router.put(usersResource + '/:userEmail/password', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging user=' + req.params.userEmail });

    const user = new UserModel(
        req.params.userEmail,
        req.body.user_pass
    );

    const response = await userService.updateUserPassword(user);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        })
    }
});

router.delete(usersResource + '/:userEmail', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging user=' + req.params.userEmail });

    const user = new UserModel(req.params.userEmail);

    const response = await userService.deleteUser(user);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        })
    }
});

router.post(usersResource + '/:userId/meetups/:meetupId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging userid=' + req.params.userId });

    const response = await userService.registerToMeetup(req.params.userId, req.params.meetupId);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        });
    }
});

router.put(usersResource + '/:userId/meetups/:meetupId', async (req, res) => {

    logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, { tags: 'http', additionalInfo: 'Logging userid=' + req.params.userId });

    const response = await userService.notifyAssistanceInMeetup(req.params.userId, req.params.meetupId);

    if (response && response.code) {
        return res.status(response.code).send(response.message);
    } else {
        return res.status(500).send({
            message: "Unexpected error."
        });
    }
});

module.exports = router;
