module.exports = `
  type Query {
    feed: [Feed],
    lights: [Light],
    weather(lon: Float, lat: Float): Weather
  }

  type Feed {
    title: String,
    link: String,
    date: String,
    source: String
  }

  type Light {
    id: String,
    name: String,
    type: String,
    status: String
  }

  type Weather {
    city: String,
    kind: String,
    temp: Float,
    temp_min: Float,
    temp_max: Float,
    pressure: Float,
    wind_speed: Float
  }

  type Mutation {
    toggleLight (
      lightId: String,
      isOn: Boolean
    ) : Light
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`
