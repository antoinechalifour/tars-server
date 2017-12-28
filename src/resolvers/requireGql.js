const fs = require('fs')

/**
 * Load a GraphQL type or mutation and returns
 * its string representation.
 * @param {String} path - The schema path.
 */
module.exports = function requireGql (path) {
  return fs.readFileSync(path, 'utf-8')
}
