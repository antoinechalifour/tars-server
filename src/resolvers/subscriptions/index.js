const path = require('path')
const requireGql = require('../requireGql')

module.exports = `
  type RootSubscription {
    ${requireGql(path.join(__dirname, './lists.graphql'))}
  }
`
