require('dotenv').config()
const port = process.env.PORT

// Database configuration
const Knex = require('knex')
const dbConfig = require('./knexfile')
const knex = Knex(dbConfig)

knex.migrate.latest(dbConfig)

// Dependency injection configuration
const { createContainer, asFunction, asValue } = require('awilix')
const container = createContainer()
container.register({
  // Values
  knex: asValue(knex),

  // Repositories (Abstraction over persistance layer)
  rssRepository: asFunction(require('./src/repositories/Rss')),

  // Services (business layer)
  rssService: asFunction(require('./src/services/Rss')),
  lightsService: asFunction(require('./src/services/LightsDomoticz'))
})

// App configuration
const App = require('./src/App')
const app = App({ container })

app.listen(port, () => console.log(`App running @ http://0.0.0.0:${port}`))
