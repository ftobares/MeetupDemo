import axios from "axios";

const AUTH_RESOURCE = process.env.REACT_APP_AUTHENTICATION_RESOURCE
const CATEGORY_RESOURCE = process.env.REACT_APP_CATEGORIES_RESOURCE
const COUNTRIES_RESOURCE = process.env.REACT_APP_COUNTRIES_RESOURCE
const STATES_RESOURCE = process.env.REACT_APP_STATES_RESOURCE
const CITIES_RESOURCE = process.env.REACT_APP_CITIES_RESOURCE
const USERS_RESOURCE = process.env.REACT_APP_USERS_RESOURCE
const WEATHER_ENDPOINT = process.env.REACT_APP_WEATHER_ENDPOINT;

/* Interceptor to add automatically the user token */
axios.interceptors.request.use(
    (config) => {
        
        if(!config.url.includes(AUTH_RESOURCE)
        && !(config.url.includes(USERS_RESOURCE) && config.method === 'post')
        && !config.url.includes(WEATHER_ENDPOINT) 
        && !config.url.includes(CATEGORY_RESOURCE)
        && !config.url.includes(COUNTRIES_RESOURCE) 
        && !config.url.includes(STATES_RESOURCE) 
        && !config.url.includes(CITIES_RESOURCE)){            
            const userToken = JSON.parse(localStorage.getItem("userToken"));
            if (userToken) {
                config.headers.Authorization = `Bearer ${userToken}`;
                localStorage.setItem("lastHTTPRequest", Date());
            } else {
                console.log("sin token user");

                localStorage.clear();
                window.location.reload();
            }
        }

        return config;
    },
    (err) => Promise.reject(err)
);
// createAxiosResponseInterceptor();

/* Generic request functions */
export async function postDataAsync(url, data, config) {    
    try {
        return await axios.post(url, data, config);
    } catch (err) {
        console.log(err);
        return err.response;
    }
}

export async function putDataAsync(url, data, config) {
    try {
        return await axios.put(url, data, config);
    } catch (err) {
        console.log(err);
        return err.response;
    }
}

export async function getDataAsync(url, config) {
    try {
        return await axios.get(url, config);
    } catch (err) {
        console.log(err);
        return err.response;
    }
}

export async function deleteDataAsync(url, config) {
    try {
        console.log("request delete:", url);
        return await axios.delete(url, config);
    } catch (err) {
        console.log(err);
        return err.response;
    }
}

/* Custom Interceptor to refresh expired token */
// function createAxiosResponseInterceptor() {
//     let loop = 0;
//     let isRefreshing = false;
//     let subscribers = [];

//     function subscribeTokenRefresh(cb) {
//         subscribers.push(cb);
//     }

//     function onRrefreshed(token) {
//         subscribers.map((cb) => cb(token));
//     }

//     axios.interceptors.response.use(undefined, (err) => {
//         let status = 500;
//         const { config } = err;
//         const originalRequest = config;

//         const user_refresh_token = JSON.parse(
//             localStorage.getItem("refresh_token")
//         );

//         console.log("axios interceptor", err.response);

//         if (!err.response) {
//             status = 401;
//             console.log("401");
//         } else {
//             status = err.response.status;
//         }

//         if (user_refresh_token === null || status === 400) {
//             console.log("refresh en null");

//             localStorage.clear();
//             window.location.reload();
//             return;
//         }

//         if (status === 401 || (status === 403 && loop < 2)) {
//             // loop 1
//             loop++;
//             if (!isRefreshing) {
//                 isRefreshing = true;

//                 let config = {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 };

//                 const payload2 = {
//                     refresh_token: user_refresh_token,
//                 };

//                 axios
//                     .post(global.GATEKEEPER + "/refresh_token", payload2, config)
//                     .then((res) => {
//                         console.log("refreshing token");

//                         if (res.data) {
//                             localStorage.setItem(
//                                 "user_token",
//                                 JSON.stringify(res.data.access_token)
//                             );
//                             console.log("Ok refresh");
//                             localStorage.setItem(
//                                 "refresh_token",
//                                 JSON.stringify(res.data.refresh_token)
//                             );

//                             isRefreshing = false;
//                             onRrefreshed(res.data.refresh_token);

//                             subscribers = [];
//                         }
//                     })
//                     .catch((error) => {
//                         console.log("error fatal");
//                         // localStorage.clear("user");

//                         return Promise.reject(error);
//                     })
//                     .finally();
//             }

//             return new Promise((resolve) => {
//                 subscribeTokenRefresh((token) => {
//                     console.log("resolviendo request original");
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     resolve(axios(originalRequest));
//                 });
//             });
//         }

//         return Promise.reject(err);
//     });
// }