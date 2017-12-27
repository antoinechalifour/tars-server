module.exports = ({ knex }) => ({
  findSources: () => knex('rss'),
  source: id => knex('rss').where({ id }).first(),
  create: fields => knex('rss').insert(fields),
  delete: id => knex('rss').where({ id }).delete()
})
