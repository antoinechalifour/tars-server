const assert = require('assert')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')

module.exports = function createSubscriptionServer ({ schema, options }) {
  return function runSubscriptionServer (server) {
    new SubscriptionServer(
      {
        schema,
        execute,
        subscribe
      },
      {
        path: options.subscriptionsPath,
        server
      }
    )
  }
}
