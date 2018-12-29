import React, { Component } from "react";
import Geosuggest from "react-geosuggest";
import Loader from "react-loader-spinner";

import getUserLocation from "../../services/getLocation";
import getWeatherForCity from "../../services/getWeather";
import checkLocationPermission from "../../services/checkLocationPermission";

class App extends Component {
  state = {
    weatherInformation: null,
    city: null,
    isRendering: false,
    isLocationEnabled: true
  };

  async componentDidMount() {
    const permissionState = await checkLocationPermission();
    if(permissionState === "denied") {
      this.setState({ isLocationEnabled: false });
      return;
    } else if (permissionState === "granted") {
      this.setState({ isLocationEnabled: true });
      this.getWeatherForCurrentLocation();
      return;
    } else {
      this.setState({ isLocationEnabled: false });
      navigator.geolocation.getCurrentPosition(() => {
        this.setState({ isLocationEnabled: true });
        this.getWeatherForCurrentLocation();
      });
    }
  }

  getWeatherForCurrentLocation = async () => {
    this._geoSuggest.clear();
    this.setState({ isRendering: true });
    const city = await getUserLocation();
    const { data: weatherData } = await getWeatherForCity(city);
    const weatherInformation = {
      weather: weatherData.weather[0],
      main: weatherData.main,
      country: weatherData.sys.country
    };
    this.setState({ city, weatherInformation, isRendering: false });
  };

  separateByComma = (input) => {
    const splittedStr = input.split(" ");
    const result =  splittedStr.map(item => item.replace(",", "") );
    return result.join(",");
  }

  onSuggestSelect = async suggest => {
    this.setState({ isRendering: true });
    if (!suggest) return;
    const { label } = suggest;
    const city = this.separateByComma(label);
    try {
      const { data: weatherData } = await getWeatherForCity(city);
      const weatherInformation = {
        weather: weatherData.weather[0],
        main: weatherData.main
      };
      this.setState({ city: null, weatherInformation, isRendering: false });
    } catch (error) {
      console.log("Error ");
      this.setState({
        city: null,
        weatherInformation: null,
        isRendering: false
      });
    }
  };

  render() {
    const {
      weatherInformation,
      city,
      isRendering,
      isLocationEnabled
    } = this.state;

    if (!isLocationEnabled) {
      return (
        <div className="bg-dark">
          <div className="warning">
            <h3 className="u-font-size-s u-nowrap">Please enable location permission</h3>
          </div>
        </div>
      );
    }

    return (
      <div>
        {isRendering && (
          <div className="loader">
            <Loader type="Oval" color="#FFF" height="30" width="30" />
          </div>
        )}
        <Geosuggest
          ref={el => (this._geoSuggest = el)}
          placeholder="Search city name"
          onSuggestSelect={this.onSuggestSelect}
        />
        <div className="weather-details">
          {weatherInformation ? (
            <React.Fragment>
              <ul className="weather-details-wrapper">
                <li className="weather-details__item u-font-size-xxl">
                  {`${Math.round(weatherInformation.main.temp)}º`}
                </li>
                <li className="weather-details__item u-font-size-m">
                  {weatherInformation.weather.main}
                </li>
                <li className="weather-details__item u-capitalize u-font-size-s">
                  {`(${weatherInformation.weather.description})`}
                </li>
              </ul>
              <button
                className="btn"
                onClick={this.getWeatherForCurrentLocation}
              >
                {city ? `${city}` : "Get weather for your location"}
              </button>
            </React.Fragment>
          ) : (
            <p className="u-font-size-s">Fetching weather data...</p>
          )}
        </div>
      </div>
    );
  }
}

export default App;
