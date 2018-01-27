require('dotenv').config()
const logging = require('./src/util/logging')({ level: process.env.LOG_LEVEL })
const port = process.env.PORT

// Database configuration
const Knex = require('knex')
const dbConfig = require('./knexfile')
const knex = Knex(dbConfig)

knex.migrate.latest(dbConfig)

// Real time stuff
const { PubSub } = require('graphql-subscriptions')
const pubSub = new PubSub()

// Dependency injection configuration
const { createContainer, asFunction, asValue } = require('awilix')
const container = createContainer()
container.register({
  // Values
  knex: asValue(knex),
  pubSub: asValue(pubSub),
  logging: asValue(logging),

  // Repositories (Abstraction over persistance layer)
  rssRepository: asFunction(require('./src/repositories/Rss')),
  listsRepository: asFunction(require('./src/repositories/Lists')),
  eventsRepository: asFunction(require('./src/repositories/Events')),

  // Events
  events: asFunction(require('./src/services/Events')),
  listsEvents: asFunction(require('./src/services/Events/Lists')),
  lightsEvents: asFunction(require('./src/services/Events/Lights')),

  // Services (business layer)
  rssService: asFunction(require('./src/services/Rss')),
  lightsService: asFunction(require('./src/services/Lights/Hue')),
  weatherService: asFunction(require('./src/services/Weather')),
  listsService: asFunction(require('./src/services/Lists')),
  calendarService: asFunction(require('./src/services/Calendar/Google')),
  widgetsService: asFunction(require('./src/services/Widgets')),
  nlpService: asFunction(require('./src/services/NLP/Wit'))
})

// App configuration
const serverOptions = {
  host: '0.0.0.0',
  port,
  subscriptionsPath: process.env.SUBSCRIPTIONS_PATH
}
const App = require('./src/App')
const logger = logging.getLogger('App')
const { app, runSubscriptionServer } = App({
  container,
  options: serverOptions
})

const server = app.listen(port, () =>
  logger.info(`Running @ http://${serverOptions.host}:${serverOptions.port}`)
)
runSubscriptionServer(server)

// Run user scripts
require('./scripts')(container)
