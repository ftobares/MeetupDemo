'use strict'

// Database pool
const poolDB = require('@config/database.config')

// Logger & Properties
const logger = require('@config/logger.config')
const props = require('@config/properties')

// Services
const meetupService = require('@service/meetupService');
const userService = require('@service/userService')
const categoriesService = require('@service/categoriesService');

// Import dependencies
const ResponseModel = require('@models/responseModel').ResponseModel
const MeetupModel = require('@models/MeetupModel').MeetupModel

const createMeetup = async (meetup) => {

    const client = await poolDB.connect();
    let resp = new ResponseModel();
    await client.query('BEGIN');

    try{            

        meetup = await meetupService.createMeetup(client, meetup);
        console.log(meetup)
        if (meetup.id != null) {          
        
            const categoryResp = await categoriesService.createRelationMeetupCategories(meetup.id, meetup.categories);
            
            if (categoryResp && categoryResp.find((e) => e.code !== 201)) {
                logger.error('Error creating meetup-category relations');
                resp.code = 207
                resp.message = { 
                    meetup: {
                        meetup_owner: meetup.owner,
                        meetup_title: meetup.title,
                        meetup_date: meetup.date,
                        meetup_description: meetup.description,
                        meetup_categories: meetup.categories,
                        meetup_id: meetup.id
                    }, 
                    errors: categoryResp.filter((e) => e.code !== 201) 
                };
            } else {
                console.log(meetup)
                resp.code = 201
                resp.message = {
                    meetup_owner: meetup.owner,
                    meetup_title: meetup.title,
                    meetup_date: meetup.date,
                    meetup_description: meetup.description,
                    meetup_categories: meetup.categories,
                    meetup_id: meetup.id
                };
            }

            await client.query('COMMIT');
            
        } else {
            resp.code = 400
            resp.message = 'Error creating meetup'
        }
    }catch(exception){
        logger.error(exception);
        await client.query('ROLLBACK');
        resp.code = 500
        resp.message = 'Unexpected error';
    } finally {
        client.release();
    }
    
    return resp;
}

const updateMeetup = async (meetup) => {

    const client = await poolDB.connect();
    let resp = new ResponseModel();
    
    try{
        await client.query('BEGIN');

        let meetupUpdate = await meetupService.updateMeetup(client, meetup);
        if (meetupUpdate.code === 200) {
            let resp = new ResponseModel();        

            const categoryResponse = await categoriesService.updateRelationCategoryMeetup(meetup.id, meetup.categories);
            if (categoryResponse && categoryResponse.find((e) => e.code !== 201)) {
                logger.error('Error updating meetup-category relations');
                resp.code = 207
                resp.message = { meetup: meetup, errors: categoryResponse.filter((e) => e.code !== 201) };
            } else {
                resp.code = 200
                resp.message = meetup;
            }

            await client.query('COMMIT');
            
        } else {
            resp.code = meetupUpdate.code;
            resp.message = meetupUpdate.message;
        }
    }catch(exception){
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error';
    } finally {
        client.release();
    }
    
    return resp;
}

const deleteMeetup = async (meetupId) => {

    const client = await poolDB.connect();
    let resp = new ResponseModel();
    
    try{
        await client.query('BEGIN');
        let meetupDelete = await meetupService.deleteMeetup(client, meetupId);
        if (meetupDelete.code === 200) {
            let resp = new ResponseModel();

            const userResp = await userService.deleteRelationMeetupUser(client, meetupId);
            if (userResp.code !== 200) {
                await client.query('ROLLBACK');                
                return userResp;
            }

            const categoryResponse = await categoriesService.deleteRelationMeetupCategories(meetupId);
            if (categoryResponse && categoryResponse.find((e) => e.code !== 200)) {
                logger.error('Error updating meetup-category relations');
                resp.code = 207
                resp.message = { message: meetupDelete.message, errors: categoryResponse.filter((e) => e.code !== 200) };
            } else {
                resp.code = 200
                resp.message = meetupDelete.message;
            }

            await client.query('COMMIT');
            
        } else {
            resp.code = meetupDelete.code
            resp.message = meetupDelete.message;
        }
    }catch(exception){
        logger.error(exception);
        resp.code = 500
        resp.message = 'Unexpected error';
    } finally {
        client.release();
    }
    
    return resp;
}

module.exports = {
    createMeetup,    
    updateMeetup,
    deleteMeetup
}