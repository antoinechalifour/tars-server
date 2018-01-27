const { withFilter } = require('graphql-subscriptions')

/**
 * Module that builds the GraphQL configuration.
 * It simply maps GraphQL queries to services.
 *
 * @param {Object} container The DI container.
 */
module.exports = container => {
  const rssService = container.resolve('rssService')
  const lightsService = container.resolve('lightsService')
  const weatherService = container.resolve('weatherService')
  const listsService = container.resolve('listsService')
  const calendarService = container.resolve('calendarService')
  const widgetsService = container.resolve('widgetsService')
  const nlpService = container.resolve('nlpService')
  const events = container.resolve('events')
  const pubSub = container.resolve('pubSub')
  const serverPosition = {
    lon: process.env.WEATHER_LON,
    lat: process.env.WEATHER_LAT
  }

  return {
    typeDefs: require('./typeDefs'),
    resolvers: {
      RootQuery: {
        feed: () => rssService.feed(),
        light: (_, { id }) => lightsService.light(id),
        lights: () => lightsService.lights(),
        weather: (_, { lon, lat }) => {
          const position = lon ? { lon, lat } : serverPosition
          return weatherService.getCurrentWeather(position)
        },
        weatherForecast: (_, { lon, lat }) => {
          const position = lon ? { lon, lat } : serverPosition
          return weatherService.getForecast(position)
        },
        lists: () => listsService.lists(),
        list: (_, { id }) => listsService.list(id),
        sources: () => rssService.sources(),
        calendar: () => calendarService.events(),
        events: () => events.all(),
        widgets: () => widgetsService.widgets()
      },

      Widget: {
        __resolveType (data, ctx, info) {
          switch (data.type) {
            case 'weather':
            case 'rss':
            case 'lights':
            case 'calendar':
              return 'WidgetSimple'

            case 'list':
              return 'WidgetList'

            default:
              throw new Error(
                `Undefined GraphQL type for widget: "${data.type}"`
              )
          }
        }
      },
      RootMutation: {
        /*************************************************************
         *                       LIGHTS API
         *************************************************************/
        switchLight: async (_, { input }) => {
          const light = await lightsService.toggleLight(input.id, input.isOn)

          return { light }
        },
        setLightBrightness: async (_, { input }) => {
          const light = await lightsService.updateLight(input.id, {
            bri: input.bri
          })

          return { light }
        },
        updateLightInformation: async (_, { input }) => {
          const light = await lightsService.updateLight(input.id, {
            name: input.name
          })

          return { light }
        },

        /*************************************************************
         *                        LISTS API
         *************************************************************/
        createList: async (_, { input }) => {
          const list = await listsService.create(input.name)

          pubSub.publish('listCreated', { listId: list.id })

          return { list }
        },
        updateList: async (_, { input }) => {
          const list = await listsService.update(input.id, {
            name: input.name
          })

          pubSub.publish('listUpdated', { listId: list.id })

          return { list }
        },
        deleteList: async (_, { input }) => {
          const list = await listsService.list(input.id)
          await listsService.delete(input.id)

          pubSub.publish('listDeleted', { listId: list.id })

          return { list }
        },
        addListItem: async (_, { input }) => {
          const item = await listsService.addItem(input.listId, input.text)
          const list = await listsService.list(input.listId)

          pubSub.publish('listItemCreated', {
            listId: list.id,
            itemId: item.id
          })

          return { list, item }
        },
        updateListItem: async (_, { input }) => {
          const item = await listsService.updateItem(input.id, {
            text: input.text,
            done: input.done
          })

          pubSub.publish('listItemUpdated', {
            listId: item.listId,
            itemId: item.id
          })

          return { item }
        },
        deleteListItem: async (_, { input }) => {
          const item = await listsService.item(input.id)
          await listsService.deleteItem(input.id)

          pubSub.publish('listItemDeleted', {
            listId: item.listId,
            itemId: input.id
          })

          return { item }
        },

        /*************************************************************
         *                        RSS API
         *************************************************************/
        addRssSource: async (_, { input }) => {
          const source = await rssService.addSource(input.url)

          return { source }
        },
        deleteRssSource: async (_, { input }) => {
          const source = await rssService.source(input.id)
          await rssService.deleteSource(input.id)

          return { source }
        },

        conversation: async (_, { input }) => {
          const response = await nlpService.process(input.text)

          return {
            conversation: { text: response }
          }
        }
      },
      RootSubscription: {
        lightUpdated: {
          subscribe: () => pubSub.asyncIterator('lightUpdated'),
          resolve: light => light
        },

        listCreated: {
          subscribe: () => pubSub.asyncIterator('listCreated'),
          resolve: ({ listId }) => listsService.list(listId)
        },

        listDeleted: {
          subscribe: () => pubSub.asyncIterator('listDeleted'),
          resolve: ({ listId }) => ({ id: listId })
        },

        listUpdated: {
          subscribe: withFilter(
            () => pubSub.asyncIterator('listUpdated'),
            ({ listId }, variables) => listId === variables.id
          ),
          resolve: ({ listId }) => listsService.list(listId)
        },

        listItemCreated: {
          subscribe: withFilter(
            () => pubSub.asyncIterator('listItemCreated'),
            ({ listId, itemId }, variables) => listId === variables.listId
          ),
          resolve: ({ itemId }) => listsService.item(itemId)
        },

        listItemUpdated: {
          subscribe: withFilter(
            () => pubSub.asyncIterator('listItemUpdated'),
            ({ listId, itemId }, variables) => listId === variables.listId
          ),
          resolve: ({ itemId }) => listsService.item(itemId)
        },

        listItemDeleted: {
          subscribe: withFilter(
            () => pubSub.asyncIterator('listItemDeleted'),
            ({ listId, itemId }, variables) => listId === variables.listId
          ),
          resolve: ({ itemId }) => ({ id: itemId })
        }
      }
    }
  }
}
