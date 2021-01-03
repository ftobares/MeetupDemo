import { getDataAsync, postDataAsync, putDataAsync, deleteDataAsync } from './httpUtils';

const COUNTRIES_ENDPOINT = process.env.REACT_APP_BACKEND_HOST 
    + process.env.REACT_APP_API_MAIN 
    + process.env.REACT_APP_COUNTRIES_RESOURCE;
const STATES_ENDPOINT = process.env.REACT_APP_BACKEND_HOST 
    + process.env.REACT_APP_API_MAIN
    + process.env.REACT_APP_STATES_RESOURCE;
const CITIES_ENDPOINT = process.env.REACT_APP_BACKEND_HOST 
    + process.env.REACT_APP_API_MAIN
    + process.env.REACT_APP_CITIES_RESOURCE;

export const getCountries = async (callback, callbackError) => {

    debugger
    let response = await getDataAsync(
        COUNTRIES_ENDPOINT
    );

    if(response && response.status === 200){
        return callback(response.data);
    }else{
        return callbackError(response.data.message);
    }
}

export const getStates = async (countryId) => {
    return await getDataAsync(
        STATES_ENDPOINT + '/countries/' + countryId
    );
}

export const getCities = async (stateId) => {
    return await getDataAsync(
        CITIES_ENDPOINT + '/states/' + stateId
    );
}

export const getCity = async (cityId, callback, callbackError) => {
    let response = await getDataAsync(
        CITIES_ENDPOINT + '/' + cityId
    );
    if(response && response.status === 200){
        return callback(response.data);
    }else{
        return callbackError(response.data.message);
    }
}
