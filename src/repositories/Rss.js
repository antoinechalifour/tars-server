/**
 * Factory function for the RSS persistance layer.
 *
 * @param {Object} depencencies - The module dependencies.
 */
module.exports = function RssRepository ({ knex }) {
  return {
    /**
     * Returns all sources.
     */
    sources: () => knex('rss'),

    /**
     * Returns a source by id.
     * @param {Number} id - The source id.
     */
    source: id => knex('rss').where({ id }).first(),

    /**
     * Creates a source.
     * @param {Object} fields - The source to create.
     * @param {String} [fields.source] - The source url.
     */
    create: fields => knex('rss').insert(fields),

    /**
     * Dleetes a source by id.
     * @param {Number} id - The id of the source to delete.
     */
    delete: id => knex('rss').where({ id }).delete()
  }
}
