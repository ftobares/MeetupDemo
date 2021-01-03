import { getDataAsync } from './httpUtils';

const WEATHER_ENDPOINT = process.env.REACT_APP_WEATHER_ENDPOINT;
const API_KEY = process.env.REACT_APP_WEATHER_APIKEY;

export const getWeatherForecast = async (cityLatitude, cityLongitude) => {
    let response = await getDataAsync(
        WEATHER_ENDPOINT + "?lat="+cityLatitude+"&lon="+cityLongitude+"&units=metric&lang=sp&appid=" + API_KEY
    );

    let forecastWeather = [];
    if(response && response.status === 200){
        for(let i=0; i < response.data.daily.length; i++){
            forecastWeather.push({
                date: response.data.daily[i].dt,
                minTemp: response.data.daily[i].temp.min,
                maxTemp: response.data.daily[i].temp.max,
                weather: response.data.daily[i].weather[0].description
            });
        }
    }

    return forecastWeather;
}

export const getCurrentWeather = async (cityLatitude, cityLongitude) => {    

    let response = await getDataAsync(
        WEATHER_ENDPOINT + "?lat="+cityLatitude+"&lon="+cityLongitude+"&units=metric&lang=sp&appid=" + API_KEY
    );

    let forecastWeather;
    if(response && response.status === 200){
        forecastWeather = {
            date: response.data.current.dt,
            minTemp: response.data.current.temp,
            maxTemp: response.data.current.temp,
            weather: response.data.current.weather[0].description,
            weatherId: response.data.current.weather[0].id
        }
    }

    return forecastWeather;
}