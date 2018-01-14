exports.up = function (knex, Promise) {
  return knex.schema.createTable('events', table => {
    table.increments().primary()
    table.string('type')
    table.timestamps(true, true)
    table.json('data')
    table.date('fired_at')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('events')
}
