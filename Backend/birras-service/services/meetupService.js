'use strict'

// Database pool
const poolDB = require('@config/database.config')

// Logger & Properties
const logger = require('@config/logger.config')
const props = require('@config/properties')
const schema = props.databaseSchema

// Import dependencies
const ResponseModel = require('@models/responseModel').ResponseModel
const MeetupModel = require('@models/MeetupModel').MeetupModel
const categoriesService = require('@service/categoriesService');
const utils = require('@service/utils');

const createMeetup = async (clientDb, meetup) => {
    
    logger.info("Creating meetup by owner="+meetup.owner); 

    const res = await clientDb.query('INSERT INTO '+schema+'.meetups '+
                                     '( '+
                                     '  meetup_owner, '+
                                     '  meetup_title, '+
                                     '  meetup_date, '+
                                     '  meetup_description '+                                     
                                     ') '+
                                     'VALUES '+
                                     '($1, '+
                                     ' $2::text, '+
                                     ' TO_TIMESTAMP($3::text, \'DD/MM/YYYY HH24:MI\'), '+
                                     ' $4::text) ' +
                                     'RETURNING meetup_id',
                                     [
                                        meetup.owner,
                                        meetup.title,
                                        meetup.date,
                                        meetup.description                                        
                                     ]
    );

    if(res.rows.length > 0 && res.rows[0].meetup_id !== null){
        logger.warn("Meetup creation success. meetup owner="+meetup.owner);
        meetup.id = res.rows[0].meetup_id;
    }else{
        logger.warn("Creation failed. meetup owner="+meetup.owner);            
    }

    return meetup;
}

const updateMeetup = async (clientDb, meetup) => {   
    let resp = new ResponseModel();
    
    logger.info("Updating meetupid="+meetup.id);

    const res = await clientDb.query('UPDATE '+schema+'.meetups '+
                                     'SET '+                                     
                                     '  meetup_title = $2::text, '+
                                     '  meetup_date = TO_TIMESTAMP($3::text, \'DD/MM/YYYY HH24:MI\'), '+
                                     '  meetup_description = $4::text '+                                    
                                     'WHERE meetup_id = $1', 
                                     [
                                        meetup.id,
                                        meetup.title,
                                        meetup.date,
                                        meetup.description
                                     ]
                                    );
    if(res.rowCount > 0){
        logger.warn("Meetup updated success. meetupid="+meetup.id);
        resp.code = 200;
        resp.message = meetup;
    }else{
        logger.warn("Update meetup failed. meetupid="+meetup.id)
        resp.code = 400
        resp.message = 'Update meetup failed.'
    }

    return resp;
}

const getAllMeetups = async (ownerFilter, categoryFilter) => {
    const client = await poolDB.connect();
    let globalResponse = new ResponseModel();

    try{
        logger.info("Fetching all meetups");

        let queryResponse;
        let sql = 'SELECT  m.meetup_id, '+                                       
                    '        m.meetup_owner, '+
                    '        m.meetup_title, '+
                    '        m.meetup_date, '+
                    '        m.meetup_description ';

        if(categoryFilter){            
            sql = sql.concat('FROM '+schema+'.meetups m, '+schema+'.meetup_category mc ');
            sql = sql.concat('WHERE mc.meetup_id = m.meetup_id ');
            sql = sql.concat('AND   mc.category_id IN ($1) '); 

            queryResponse = await client.query(sql,                                     
                                                [
                                                    categoryFilter
                                                ]
                                              );

        }else if(ownerFilter){
            sql = sql.concat(', COUNT(um.meetup_id) as enrolled ');            
            sql = sql.concat('FROM '+schema+'.meetups m, '+schema+'.user_meetup um ');
            sql = sql.concat('WHERE meetup_owner = $1');
            sql = sql.concat('AND   um.meetup_id = m.meetup_id ');
            sql = sql.concat('GROUP BY m.meetup_id'); 

            queryResponse = await client.query(sql,                                     
                                                [
                                                    ownerFilter
                                                ]
                                              );
        }else{
            // FIXME agregar paginado
            sql = sql.concat('FROM '+schema+'.meetups m');

            queryResponse = await client.query(sql);
        }

        console.log(sql)
        
        if(queryResponse.rows.length > 0){
            logger.warn("Meetup fetch success.");
            const meetup = queryResponse.rows.map((element) => {
                return new MeetupModel(
                    element.meetup_owner,
                    element.meetup_title,
                    element.meetup_date,
                    element.meetup_description,
                    null, //Falta implementar
                    element.meetup_id,
                    element.enrolled
                );
            });
            
            globalResponse.code = 200
            globalResponse.message = meetup
        }else{
            logger.warn("Fetching return no elements.")
            globalResponse.code = 200
            globalResponse.message = []
        }
    }catch(exception){
        logger.error(exception);      
        globalResponse.code = 500
        globalResponse.message = 'Unexpected error'
    } finally {       
        client.release();    
    }
    return globalResponse;
}

const getMeetupById = async (meetupId) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try{
        logger.info("Fetching meetupid="+meetupId);        

        const res = await client.query('SELECT  m.meetup_id, '+                                       
                                       '        m.meetup_owner, '+
                                       '        m.meetup_title, '+
                                       '        m.meetup_date, '+
                                       '        m.meetup_description, '+
                                       '        COUNT(um.meetup_id) as enrolled '+
                                       'FROM '+schema+'.meetups m, '+schema+'.user_meetup um '+
                                       'WHERE   m.meetup_id = $1 ' +
                                       'AND     um.meetup_id = m.meetup_id ' +
                                       'GROUP BY m.meetup_id',                                     
                                     [
                                        meetupId
                                     ]
                                    );
        if(res.rows.length > 0){
            logger.warn("Meetup fetch success. meetupId="+meetupId);
            const meetup = new MeetupModel(
                res.rows[0].meetup_owner,
                res.rows[0].meetup_title,
                res.rows[0].meetup_date,
                res.rows[0].meetup_description,
                null, //Falta implementar
                res.rows[0].meetup_id,
                res.rows[0].enrolled
            );
            resp.code = 200
            resp.message = meetup
        }else{
            logger.warn("Meetup fetch failed. meetupId="+meetupId);
            resp.code = 400
            resp.message = 'Meetup fetch failed'
        }
    }catch(exception){
        logger.error(exception);       
        resp.code = 500
        resp.message = 'Unexpected error'
    } finally {       
        client.release();    
    }
    return resp;
}

const deleteMeetup = async (clientDb, meetupId) => {    
    let resp = new ResponseModel();

    logger.info("Deleting meetupId="+meetupId);        

    const res = await clientDb.query('DELETE FROM '+schema+'.meetups '+
                                   'WHERE meetup_id = $1', 
                                    [
                                        meetupId
                                    ]
                                  );
    if(res.rowCount > 0){
        logger.warn("Meetup deleted. meetupId="+meetupId);        
        resp.code = 200;
        resp.message = 'Meetup deleted';
    }else{
        logger.warn("Meetup delete failed. meetupId="+meetupId)
        resp.code = 400
        resp.message = 'Meetup delete failed.'
    }
    
    return resp;
}

module.exports = {
    createMeetup,
    getAllMeetups,
    getMeetupById,
    updateMeetup,
    deleteMeetup
};