const path = require('path')
const requireGql = require('../requireGql')

module.exports = [
  `
  type RootQuery {
    # RSS
    feed: [Feed]!,
    sources: [Source]!,

    # Lights
    lights: [Light]!,
    light(id: String!): Light!,

    # Weather / Temperature
    weather(lon: Float, lat: Float): Weather!,
    weatherForecast(lon: Float, lat: Float): [Weather]!

    # Lists
    lists: [List]!,
    list(id: Int): List!

    # Calendar
    calendar: Calendar!

    # Events / Logs
    events: [Event]!

    widgets: [Widget]!
  }
`,
  requireGql(path.join(__dirname, './Feed.graphql')),
  requireGql(path.join(__dirname, './Light.graphql')),
  requireGql(path.join(__dirname, './Weather.graphql')),
  requireGql(path.join(__dirname, './Rss.graphql')),
  requireGql(path.join(__dirname, './Lists.graphql')),
  requireGql(path.join(__dirname, './Calendar.graphql')),
  requireGql(path.join(__dirname, './Events.graphql')),
  requireGql(path.join(__dirname, './Widget.graphql')),
  requireGql(path.join(__dirname, './Conversation.graphql'))
]
