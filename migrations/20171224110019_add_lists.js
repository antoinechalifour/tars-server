exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('lists', table => {
      table.increments().primary()
      table.string('name')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('list_items', table => {
      table.increments().primary()
      table.string('text')
      table.boolean('done').defaultTo(false)
      table.integer('list_id').unsigned()
      table.foreign('list_id').references('lists.id')
      table.timestamps(true, true)
    })
  ])
}

exports.down = async function (knex, Promise) {
  await knex.schema.dropTable('list_items')
  await knex.schema.dropTable('lists')
}
