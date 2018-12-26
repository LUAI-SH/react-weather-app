import http from "./httpService";
import config from "../config.json";

export default async function getWeatherForCity(city) {
  return await http.get(
    `${config.openWeather.endpoint}${city}&units=metric&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
  );
}
