module.exports = ({ knex }) => ({
  findSources: () => knex('rss')
})
