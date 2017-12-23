module.exports = `
  type Query {
    feed: [Feed],
    lights: [Light]
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
