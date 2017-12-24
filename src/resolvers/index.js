/**
 * Module that builds the GraphQL configuration.
 * @param {Object} container The DI container.
 */
module.exports = container => {
  const rssService = container.resolve('rssService')
  const lightsService = container.resolve('lightsService')
  const weatherService = container.resolve('weatherService')

  return {
    typeDefs: require('./typeDefs'),
    resolvers: {
      RootQuery: {
        feed: options => {
          return rssService.feed(options)
        },
        lights: options => {
          return lightsService.lights()
        },
        weather: (_, { lon, lat }) => {
          return weatherService.getCurrentWeather({ lon, lat })
        }
      },
      RootMutation: {
        toggleLight (_, { lightId, isOn }) {
          return lightsService.toggleLight(lightId, isOn)
        }
      }
    }
  }
}
