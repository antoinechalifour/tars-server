exports.up = function (knex, Promise) {
  return knex.schema.createTable('rss', table => {
    table.increments().primary()
    table.string('source')
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('rss')
}
