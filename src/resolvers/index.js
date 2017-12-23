/**
 * Module that builds the GraphQL configuration.
 * @param {Object} container The DI container.
 */
module.exports = container => {
  const rssService = container.resolve('rssService')
  const lightsService = container.resolve('lightsService')

  return {
    typeDefs: require('./typeDefs'),
    resolvers: {
      Query: {
        feed: options => {
          return rssService.feed(options)
        },
        lights: options => {
          return lightsService.lights()
        }
      },
      Mutation: {
        toggleLight (_, { lightId, isOn }) {
          return lightsService.toggleLight(lightId, isOn)
        }
      }
    }
  }
}
