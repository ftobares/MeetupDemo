import { getDataAsync, postDataAsync, putDataAsync, deleteDataAsync } from './httpUtils';

const AUTHENTICATION_ENDPOINT = process.env.REACT_APP_BACKEND_HOST 
    + process.env.REACT_APP_API_MAIN 
    + process.env.REACT_APP_AUTHENTICATION_RESOURCE;
const USER_ENDPOINT = process.env.REACT_APP_BACKEND_HOST 
    + process.env.REACT_APP_API_MAIN
    + process.env.REACT_APP_USERS_RESOURCE;

export const authLogin = async (user, pass, callback, callbackError) => {

    let body = {
        user: user,
        pass: pass
    }

    debugger

    let response = await postDataAsync(
        AUTHENTICATION_ENDPOINT,
        body
    );    

    if(response.status === 200){
        return callback(response.data.token);        
    }else{
        return callbackError(response.data.message);
    }
}

export const getUserData = async (userEmail) => {
    return await getDataAsync(
        USER_ENDPOINT + '/' + userEmail
    );
}

export const signupUser = async (userEmail, password, name, surname, country, city, callback, callbackError) => {
    let body = {
        user_email: userEmail,
        user_pass: password,
        user_name: name,
        user_surname: surname,
        user_country: country,
        user_city: city
    }

    debugger

    let response = await postDataAsync(
        USER_ENDPOINT,
        body
    );
    if(response && response.status === 201){
        return callback(response.data);
    }else{
        return callbackError(response.data.message);
    }
}