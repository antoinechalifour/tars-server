const path = require('path')
const fs = require('fs')

module.exports = function runScripts (container) {
  const scripts = fs.readdirSync(__dirname).filter(x => x !== 'index.js')

  scripts.forEach(name => require(path.join(__dirname, name))(container))
}
