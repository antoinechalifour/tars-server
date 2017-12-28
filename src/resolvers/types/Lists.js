module.exports = [
  `
    type List {
      id: Int!,
      name: String!,
      items: [ListItem]!
    }
  `,
  `
    type ListItem {
      id: Int!,
      text: String!,
      done: Boolean!
    }
  `
]
