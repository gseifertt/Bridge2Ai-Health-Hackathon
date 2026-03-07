const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_KEY;

async function fetchAirQuality(zip) {

  // Step 1: zip → coordinates
  const geo = await axios.get(
    `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${API_KEY}`
  );

  const { lat, lon } = geo.data;

  // Step 2: coordinates → AQI
  const air = await axios.get(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

  const aqi = air.data.list[0];

  return {
    aqi: aqi.main.aqi,
    pm2_5: aqi.components.pm2_5,
    pm10: aqi.components.pm10,
    co: aqi.components.co
  };
}

module.exports = { fetchAirQuality };