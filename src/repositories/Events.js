module.exports = function EventsRepository ({ knex }) {
  const TABLE = 'events'

  return {
    events: () => knex(TABLE),
    create: fields => knex(TABLE).insert(fields)
  }
}
