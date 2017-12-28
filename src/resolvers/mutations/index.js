const path = require('path')
const requireGql = require('../requireGql')

module.exports = `
  type RootMutation {
    ${requireGql(path.join(__dirname, './lights.graphql'))}

    ${requireGql(path.join(__dirname, './lists.graphql'))}

    ${requireGql(path.join(__dirname, './rss.graphql'))}
  }
`
