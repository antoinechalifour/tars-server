module.exports = [
  `
  type RootQuery {
    feed: [Feed],
    lights: [Light],
    weather(lon: Float, lat: Float): Weather
  }
`,
  require('./Feed'),
  require('./Light'),
  require('./Weather')
]
