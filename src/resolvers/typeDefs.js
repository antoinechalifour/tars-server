const schema = `
schema {
  query: RootQuery,
  mutation: RootMutation
}
`

module.exports = [schema, ...require('./types'), require('./mutations')]
