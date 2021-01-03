import { getDataAsync, postDataAsync, putDataAsync, deleteDataAsync } from './httpUtils';

const MEETUPS_ENDPOINT = process.env.REACT_APP_BACKEND_HOST 
    + process.env.REACT_APP_API_MAIN
    + process.env.REACT_APP_MEETUPS_RESOURCE;
const USER_ENDPOINT = process.env.REACT_APP_BACKEND_HOST 
    + process.env.REACT_APP_API_MAIN
    + process.env.REACT_APP_USERS_RESOURCE;

export const getMeetups = async () => {
    return await getDataAsync(
        MEETUPS_ENDPOINT
    );
}

export const getMeetupByOwner = async (userId) => {
    return await getDataAsync(
        MEETUPS_ENDPOINT + '?owner=' + userId
    );
}

export const getMeetupById = async (meetupId) => {
    return await getDataAsync(
        MEETUPS_ENDPOINT + '/' + meetupId
    );
}

export const putMeetupById = async (meetup) => {
    let body = {
        meetup_title: meetup.title,
        meetup_date: meetup.date,
        meetup_description: meetup.description,
        meetup_categories: meetup.categories
    }

    return await putDataAsync(
        MEETUPS_ENDPOINT + '/' + meetup.id,
        body
    );
}

export const postMeetupById = async (meetup) => {
    let body = {
        meetup_owner: 1,
        meetup_title: meetup.title,
        meetup_date: meetup.date,
        meetup_description: meetup.description,
        meetup_categories: meetup.categories
      }

    return await putDataAsync(
        MEETUPS_ENDPOINT,
        body
    );
}

export const deleteMeetupById = async (meetupId) => {
    return await deleteDataAsync(
        MEETUPS_ENDPOINT + '/' + meetupId        
    );
}

export const registerToMeetup = async (userId, meetupId) => {
    return await postDataAsync(
        USER_ENDPOINT + '/' + userId + '/meetups/' + meetupId   
    );
}

export const getMeetupsRegistered = async (userEmail) => {
    return await getDataAsync(
        USER_ENDPOINT + '/' + userEmail + '/meetups'
    );
}