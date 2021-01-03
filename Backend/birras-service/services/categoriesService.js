// Database pool
const poolDB = require('@config/database.config')

// Logger & Properties
const logger = require('@config/logger.config')
const props = require('@config/properties')
const schema = props.databaseSchema

// Import dependencies
const ResponseModel = require('@models/ResponseModel').ResponseModel
const CategoryModel = require('@models/CategoryModel').CategoryModel

const getCategories = async () => {
        const client = await poolDB.connect();
        let resp = new ResponseModel();

        try{
                const res = await client.query('SELECT  category_id, ' +
                                               '        category_title, ' +
                                               '        category_hashtag, ' +
                                               '        category_description ' +
                                               'FROM '+schema+'.categories'                                               
                                              );
                if(res.rows.length > 0){
                    logger.warn("Categories fetch");
                    let categoriesArray = res.rows.map((category) => {
                        return new CategoryModel(
                                category.category_id,
                                category.category_title,
                                category.category_hashtag,
                                category.category_description
                        );
                    });
                    resp.code = 200
                    resp.message = categoriesArray
                }else{
                    logger.warn("Error fetching categories")
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

const createRelationMeetupCategories = async(meetupId, categoriesArray) => {
    let globalResponse
    try{
        logger.info("Creating relation meetup - categories. meetupid="+meetupId);

        globalResponse = await Promise.all(
            categoriesArray.map( async (category) => {

                try{
                    const client = await poolDB.connect();
                    let resp = new ResponseModel();

                    const res = await client.query('INSERT INTO '+schema+'.meetup_category '+
                                                   '( '+
                                                   '  meetup_id, '+
                                                   '  category_id '+
                                                   ') '+
                                                   'VALUES '+
                                                   '( '+
                                                   '  $1, '+
                                                   '  $2 '+
                                                   ')', 
                                                   [
                                                       meetupId,
                                                       category
                                                   ]
                    );

                    if(res.rowCount > 0){
                        logger.warn("Relation created meetupid="+meetupId+", categoryid="+category)
                        resp.code = 201
                        resp.message = "Relation created meetupid="+meetupId+", categoryid="+category
                    }else{
                        logger.warn("Failed to create relation meetup-category. meetupid="+meetupId+", categoryid="+category)
                        resp.code = 400
                        resp.message = "Failed to create relation meetup-category. meetupid="+meetupId+", categoryid="+category
                    }

                    client.release();
                    return resp;
                }catch(exc){
                    logger.error(exc);
                    resp.code = 500
                    resp.message = exc
                }                
            })
        );

    }catch(exception){
        logger.error(exception)
        let errorResp = [{
            code: 500,
            message: 'Unexpected error: '+exception
        }];
        
        return errorResp;
    } 
    return globalResponse;
}

const deleteRelationMeetupCategories = async(meetupId) => {
    const client = await poolDB.connect();
    let resp = new ResponseModel();

    try{
        logger.info("Deleting relation meetup - categories. meetupid="+meetupId);

        const res = await client.query('DELETE FROM '+schema+'.meetup_category '+
                                       'WHERE meetup_id = $1', 
                                       [
                                          meetupId
                                       ]
                                      );
        if(res.rowCount > 0){
            logger.warn("Relations deleted for meetupid="+meetupId)
            resp.code = 200
            resp.message = "Relations deleted for meetupid="+meetupId
        }else{
            logger.warn("Error deleting relation. meetupid="+meetupId)
            resp.code = 400
            resp.message = "Error deleting relation. meetupid="+meetupId
        }

    }catch(exception){
        logger.error(exception);      
        resp.code = 500
        resp.message = 'Unexpected error: '+exception
    } finally {
        client.release();
    }
    return resp;
}

const updateRelationCategoryMeetup = async(meetupId, categoriesArray) => {
    let globalResponse
    try{
        logger.info("Creating relation meetup - categories. meetupid="+meetupId);

        let response = await deleteRelationMeetupCategories(meetupId);

        if(response.code === 200){
            globalResponse = await createRelationMeetupCategories(meetupId, categoriesArray);
        }else{
            globalResponse = [{
                code: response.code,
                message: response.message
            }]
        }

    }catch(exception){
        logger.error(exception);
        let errorResp = new ResponseModel();   
        errorResp.code = 500
        errorResp.message = exception
        return errorResp
    } 
    return globalResponse;
}

module.exports = {
    getCategories,
    createRelationMeetupCategories,
    deleteRelationMeetupCategories,
    updateRelationCategoryMeetup
};