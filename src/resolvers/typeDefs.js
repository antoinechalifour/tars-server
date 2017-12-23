module.exports = `
  type Query {
    feed: [Feed]
  }

  type Feed {
    title: String,
    link: String,
    date: String,
    source: String
  }
`
