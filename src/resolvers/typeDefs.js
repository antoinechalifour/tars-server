const schema = `
schema {
  query: RootQuery,
  mutation: RootMutation,
  subscription: RootSubscription
}
`

module.exports = [
  schema,
  ...require('./types'),
  require('./mutations'),
  require('./subscriptions')
]
