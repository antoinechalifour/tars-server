const path = require('path')
const requireGql = require('../requireGql')

module.exports = [
  `
  type RootQuery {
    feed: [Feed]!,
    lights: [Light]!,
    weather(lon: Float, lat: Float): Weather!,
    lists: [List]!,
    sources: [Source]!,
    list(id: Int): List!
  }
`,
  requireGql(path.join(__dirname, './Feed.graphql')),
  requireGql(path.join(__dirname, './Light.graphql')),
  requireGql(path.join(__dirname, './Weather.graphql')),
  requireGql(path.join(__dirname, './Source.graphql')),
  requireGql(path.join(__dirname, './Lists.graphql'))
]
