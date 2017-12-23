/**
 * Module that builds the GraphQL configuration.
 * @param {Object} container The DI container.
 */
module.exports = container => {
  const rssService = container.resolve('rssService')

  return {
    typeDefs: require('./typeDefs'),
    resolvers: {
      Query: {
        feed: options => {
          return rssService.feed(options)
        }
      }
    }
  }
}
