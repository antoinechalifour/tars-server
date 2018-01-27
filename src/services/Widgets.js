module.exports = function WidgetService ({ logging, listsService }) {
  const logger = logging.getLogger('services.widgets')
  logger.info('Creating service.')

  return {
    widgets: async () => {
      const lists = await listsService.lists()

      return [
        { type: 'weather' },
        { type: 'lights' },
        // { type: 'rss' },
        { type: 'calendar' },
        ...lists.map(x => ({
          type: 'list',
          listId: x.id
        }))
      ]
    }
  }
}
