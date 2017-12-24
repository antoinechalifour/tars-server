module.exports = `
  type RootMutation {
    ${require('./lights')}

    ${require('./lists')}
  }
`
