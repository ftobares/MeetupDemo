'use strict'

// Database pool
const poolDB = require('@config/database.config')

// Security
const CryptoJS = require("crypto-js")

// Logger & Properties
const logger = require('@config/logger.config')
const props = require('@config/properties')
const schema = props.databaseSchema
const encryptSecret = props.encryptSecret

// Importo clases
const ResponseModel = require('@models/responseModel').ResponseModel
const MeetupModel = require('@models/MeetupModel').MeetupModel

// Constants
const MEETUPS_OWNERSHIP_ENDPOINT = 'http://' + props.serverHost + ':' + props.serverPort + props.api.mainResource + props.api.version + '/meetups?owner=';
const MEETUPS_REGISTERED_ENDPOINT = 'http://' + props.serverHost + ':' + props.serverPort + props.api.mainResource + props.api.version + '/meetups?owner=';

const createUser = async (user) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Creating user=" + user.email);

        const encryptedPass = CryptoJS.AES.encrypt(user.pass, encryptSecret).toString();

        const res = await client.query('INSERT INTO ' + schema + '.users ' +
            '( ' +
            '  user_email, ' +
            '  user_pass, ' +
            '  user_name, ' +
            '  user_surname, ' +
            '  user_country, ' +
            '  user_city ' +
            ') ' +
            'VALUES ' +
            '($1::text, ' +
            ' $2::text, ' +
            ' $3::text, ' +
            ' $4::text, ' +
            ' $5, ' +
            ' $6)',
            [
                user.email,
                encryptedPass,
                user.name,
                user.surname,
                user.country,
                user.city
            ]
        );

        if (res.rowCount > 0) {
            logger.warn("User creation success. user=" + user.email)
            user.pass = null
            resp.code = 201
            resp.message = user
        } else {
            logger.warn("Creation failed. user=" + user.email)
            resp.code = 400
            resp.message = 'Creation failed.'
        }
    } catch (exception) {
        console.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const updateUser = async (user) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Updating user=" + user.email);

        const res = await client.query('UPDATE ' + schema + '.users ' +
                                        'SET ' +
                                        '  user_name = $2::text, ' +
                                        '  user_surname = $3::text, ' +
                                        '  user_country = $4, ' +
                                        '  user_city = $5, ' +
                                        '  modification_date = now() ' +
                                        'WHERE user_email = $1::text',
                                        [
                                            user.email,
                                            user.name,
                                            user.surname,
                                            user.country,
                                            user.city
                                        ]
        );
        if (res.rowCount > 0) {
            logger.warn("User updated success. user=" + user.email)
            user.pass = null
            resp.code = 200
            resp.message = user
        } else {
            logger.warn("Update user failed. user=" + user.email)
            resp.code = 400
            resp.message = 'Update user failed.'
        }
    } catch (exception) {
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const registerToMeetup = async (userId, meetupId) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Registering to meetup, userid=" + userId);       

        const res = await client.query('INSERT INTO ' + schema + '.user_meetup ' +
                                        '( '+
                                        ' user_id, ' +
                                        ' meetup_id, ' +
                                        ' attended ' +
                                        ') ' +
                                        'VALUES ' +
                                        '( ' +
                                        '$1, ' +
                                        '$2, ' +
                                        'false ' +
                                        ')',
                                        [
                                            userId,
                                            meetupId
                                        ]
        );
        if (res.rowCount > 0) {
            logger.warn("User registered to meetup. userid=" + userId)
            resp.code = 201
            resp.message = "User registered to meetup"
        } else {
            logger.warn("User failed in register to meeetup. userid=" + userId)
            resp.code = 400
            resp.message = 'User failed in register to meeetup.'
        }
    } catch (exception) {
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const notifyAssistanceInMeetup = async (userId, meetupId) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Updating userid=" + userId);       

        const res = await client.query('UPDATE ' + schema + '.user_meetup ' +
                                        'SET attended = true ' +
                                        'WHERE user_id = $1 ' +
                                        'AND meetup_id = $2',
                                        [
                                            userId,
                                            meetupId
                                        ]
        );
        if (res.rowCount > 0) {
            logger.warn("User assistance updated success. userid=" + userId)
            resp.code = 200
            resp.message = "Assistance updated"
        } else {
            logger.warn("Update user Assistance failed. userid=" + userId)
            resp.code = 400
            resp.message = 'Update user Assistance failed.'
        }
    } catch (exception) {
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const updateUserPassword = async (user) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Updating user=" + user.email);

        const encryptedPass = CryptoJS.AES.encrypt(user.pass, encryptSecret).toString();

        const res = await client.query('UPDATE ' + schema + '.users ' +
                                        'SET    user_pass = $2::text, ' +
                                        '       modification_date = now() ' +
                                        'WHERE user_email = $1::text',
                                        [
                                            user.email,
                                            encryptedPass
                                        ]
        );
        if (res.rowCount > 0) {
            logger.warn("User updated success. user=" + user.email)
            resp.code = 200
            resp.message = "Password updated"
        } else {
            logger.warn("Update user password failed. user=" + user.email)
            resp.code = 400
            resp.message = 'Update user password failed.'
        }
    } catch (exception) {
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const getUser = async (user) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Fetching user=" + user.email);

        const res = await client.query('SELECT  user_email, ' +
            '        user_name, ' +
            '        user_surname, ' +
            '        user_country, ' +
            '        user_city, ' +
            '        user_id ' +
            'FROM ' + schema + '.users ' +
            'WHERE  user_email = $1::text',
            [
                user.email
            ]
        );
        if (res.rows.length > 0) {
            logger.warn("User fetch success. user=" + user.email)
            user.name = res.rows[0].user_name;
            user.surname = res.rows[0].user_surname;
            user.country = res.rows[0].user_country;
            user.city = res.rows[0].user_city;
            user.meetupsOwnership = MEETUPS_OWNERSHIP_ENDPOINT + user.email;
            user.meetupsRegistered = MEETUPS_REGISTERED_ENDPOINT + user.email;
            user.id = res.rows[0].user_id;
            resp.code = 200
            resp.message = user
        } else {
            logger.warn("User fetch failed. user=" + user),
            resp.code = 400
            resp.message = 'User fetch failed'
        }
    } catch (exception) {
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const getMeetupsRegisteredByUser = async (user) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Fetching user=" + user.email);

        const res = await client.query('SELECT  m.meetup_id, ' +
                                        '        m.meetup_owner, ' +
                                        '        m.meetup_title, ' +
                                        '        m.meetup_date, ' +
                                        '        m.meetup_description ' +
                                        'FROM ' + schema + '.users u, ' + schema + '.user_meetup um, ' + schema + '.meetups m ' +
                                        'WHERE  u.user_email = $1::text ' +
                                        'AND um.user_id = u.user_id ' +
                                        'AND m.meetup_id = um.meetup_id ' +
                                        'AND m.meetup_date > NOW() - INTERVAL \'1 DAY\''
                                        ,
                                        [
                                            user.email
                                        ]
                                    );

        if (res.rows.length > 0) {
            logger.warn("Meetups by user fetch success. user=" + user.email)
            let meetupsArray = res.rows.map((meetup) => {
                return new MeetupModel(
                    meetup.meetup_owner,
                    meetup.meetup_title,
                    meetup.meetup_date,
                    meetup.meetup_description,
                    null,
                    meetup.meetup_id
                );
            });
            resp.code = 200
            resp.message = meetupsArray
        } else {
            logger.warn("Meetups by user fetch return empty. user=" + user),
                resp.code = 200
            resp.message = []
        }
    } catch (exception) {
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const deleteUser = async (user) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try {
        logger.info("Deleting user=" + user.email);

        const res = await client.query('DELETE FROM ' + schema + '.users ' +
                                       'WHERE user_email = $1::text',
                                       [
                                           user.email
                                       ]
        );
        if (res.rows.length > 0) {
            logger.warn("User deleted. user=" + user.email)
            resp.code = 200
            resp.message = 'User deleted'
        } else {
            logger.warn("User delete failed. user=" + user)
            resp.code = 400
            resp.message = 'User delete failed.'
        }
    } catch (exception) {
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    } finally {
        client.release();
    }
    return resp;
}

const createRelationMeetupUser = async (clientDb, meetup) => {
    let resp = new ResponseModel();

    logger.info("Creating relation meetup-owner=" + meetup.owner);

    const res = await clientDb.query('INSERT INTO ' + schema + '.user_meetup ' +
                                     '( ' +
                                     '  user_id, ' +
                                     '  meetup_id, ' +
                                     '  attended ' +
                                     ') ' +
                                     'VALUES ' +
                                     '( $1, ' +
                                     '  $2, ' +
                                     '  $3 ' +
                                     ')',
                                     [
                                         meetup.owner,
                                         meetup.id,
                                         false
                                     ]
    );

    if (res.rowCount > 0) {
        logger.warn("User Meetup relation created. user=" + meetup.owner)
        resp.code = 201
        resp.message = meetup
    } else {
        logger.warn("User Meetup relation creation failed. user=" + meetup.owner)
        resp.code = 400
        resp.message = 'User Meetup relation creation failed.'
    }

    return resp;
}

const deleteRelationMeetupUser = async (clientDb, meetupId) => {
    let resp = new ResponseModel();

    try {
        logger.info("Deleting relation meetupid=" + meetupId);

        const res = await clientDb.query('DELETE FROM ' + schema + '.user_meetup ' +
                                         'WHERE meetup_id = $1 ',
                                         [
                                             meetupId
                                         ]
        );

        if (res.rowCount > 0) {
            logger.warn("User Meetup relation deleted. meetupid=" + meetupId)
            resp.code = 200
            resp.message = "User Meetup relation deleted"
        } else {
            logger.warn("User Meetup relation failed to delete. meetupid=" + meetupId)
            resp.code = 400
            resp.message = 'User Meetup relation failed to delete.'
        }
    } catch (exception) {
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error: ' + exception
    }
    return resp;
}

module.exports = {
    createUser,
    updateUser,
    updateUserPassword,
    getUser,
    getMeetupsRegisteredByUser,
    deleteUser,
    createRelationMeetupUser,
    deleteRelationMeetupUser,
    registerToMeetup,
    notifyAssistanceInMeetup
};