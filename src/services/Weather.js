const assert = require('assert')
const axios = require('axios')

module.exports = () => {
  const API_KEY = process.env.OPEN_WEAHTER_MAP_API_KEY
  assert(
    API_KEY,
    'Environment variable "OPEN_WEAHTER_MAP_API_KEY" is required in order to use weather information'
  )

  const UNIT = process.env.OPEN_WEATHER_UNIT || 'metric'

  return {
    getCurrentWeather: async ({ lon, lat }) => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=${UNIT}`
      )
      const data = response.data
      const weather = data.weather[0]

      return {
        kind: weather.main.toLowerCase(),
        city: data.name,
        temp: data.main.temp,
        pressure: data.main.pressure,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        wind_speed: data.wind.speed
      }
    }
  }
}
