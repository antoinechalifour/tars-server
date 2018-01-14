const { createServer } = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
const { makeExecutableSchema } = require('graphql-tools')
const Logger = require('./middlewares/Logger')
const Resolvers = require('./resolvers')
const createSubscriptionServer = require('./SubscriptionServer')

/**
 * Factory function for creating an app without running it.
 * @param {Object} options The application options.
 * @param {Object} options.container The dependencies container.
 * @returns {Object} A Koa server instance.
 */
module.exports = ({ container, options }) => {
  // GraphQL Setup
  const app = new Koa()
  const router = new Router()
  const logger = Logger(container)
  const { typeDefs, resolvers } = Resolvers(container)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  app.use(cors()).use(bodyParser()).use(logger)

  router
    .post('/graphql', graphqlKoa({ schema }))
    .get('/graphql', graphqlKoa({ schema }))
    .get(
      '/graphiql',
      graphiqlKoa({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://${options.host}:${options.port}${options.subscriptionsPath}`
      })
    )

  app.use(router.routes()).use(router.allowedMethods())

  // GraphQL Subscriptions setup
  const subscriptionServer = createSubscriptionServer({ schema, options })

  return {
    app,
    runSubscriptionServer: subscriptionServer
  }
}
