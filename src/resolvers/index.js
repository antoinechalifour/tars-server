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

  return {
    typeDefs: require('./typeDefs'),
    resolvers: {
      RootQuery: {
        feed: () => rssService.feed(),
        lights: () => lightsService.lights(),
        weather: (_, { lon, lat }) =>
          weatherService.getCurrentWeather({ lon, lat }),
        lists: () => listsService.lists(),
        list: (_, { id }) => listsService.list(id),
        sources: () => rssService.sources()
      },
      RootMutation: {
        toggleLight: (_, { lightId, isOn }) =>
          lightsService.toggleLight(lightId, isOn),
        updateLight: (_, { lightId, bri, name }) =>
          lightsService.updateLight(lightId, { bri, name }),
        createList: (_, { name }) => listsService.create(name),
        updateList: (_, { id, name }) => listsService.update(id, { name }),
        deleteList: (_, { id }) => listsService.delete(id),
        addListItem: (_, { listId, text }) =>
          listsService.addItem(listId, text),
        updateListItem: (_, { id, text, done }) =>
          listsService.updateItem(id, { text, done }),
        deleteListItem: (_, { id }) => listsService.deleteItem(id),
        addSource: (_, { url }) => rssService.addSource(url),
        deleteSource: (_, { id }) => rssService.deleteSource(id)
      }
    }
  }
}
