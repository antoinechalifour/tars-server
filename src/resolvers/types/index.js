module.exports = [
  `
  type RootQuery {
    feed: [Feed]!,
    lights: [Light]!,
    weather(lon: Float, lat: Float): Weather!,
    lists: [List]!,
    list(id: Int): List!
  }
`,
  require('./Feed'),
  require('./Light'),
  require('./Weather'),
  require('./Source'),
  ...require('./Lists')
]
