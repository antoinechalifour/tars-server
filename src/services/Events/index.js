const format = require('./format')

module.exports = function EventsService ({ logging, eventsRepository }) {
  const logger = logging.getLogger('services.events')
  logger.info('Creating service.')

  return {
    async record (type, date, payload) {
      const fields = {
        fired_at: date,
        type,
        data: JSON.stringify(payload)
      }

      // FIXME: Somehow we need to either add .then
      // or await the promise to create the event ?
      await eventsRepository.create(fields)
    },

    async all () {
      const events = await eventsRepository.events()

      return events.map(format.event)
    }
  }
}
