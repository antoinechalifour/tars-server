const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
const { makeExecutableSchema } = require('graphql-tools')
const Resolvers = require('./resolvers')

/**
 * Factory function for creating an app without running it.
 * @param {Object} options The application options.
 * @param {Object} options.container The dependencies container.
 * @returns {Object} A Koa server instance.
 */
module.exports = ({ container }) => {
  const app = new Koa()
  const router = new Router()
  const { typeDefs, resolvers } = Resolvers(container)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  app.use(cors()).use(bodyParser())

  router
    .post('/graphql', graphqlKoa({ schema }))
    .get('/graphql', graphqlKoa({ schema }))
    .get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

  app.use(router.routes()).use(router.allowedMethods())

  return app
}
