const { promisify } = require('util')
const parser = require('rss-parser')
const flatten = require('array-flatten')
const fetchRss = promisify(parser.parseURL)
const formatSource = source => {
  const result = { ...source }

  result.url = result.source
  delete result.source

  return result
}

/**
 * @typedef Source A source
 * @property {number} id - The source id.
 * @property {String} url - The source URL.
 */

/**
 * @typedef FeedItem The user feed.
 * @property {String} title - The item title.
 * @property {String} link - The item link.
 * @property {String} date - The item publication date.
 * @property {Number} sourceId - The id of the source.
 * @property {String} source - The source title.
 */

/**
  * Factory function that creates a RSS service.
  * @param {Object} dependencies - The module dependencies.
  */
module.exports = function RssService ({ rssRepository }) {
  return {
    /**
     * Adds a new source in the RSS repository.
     *
     * @param {String} url - The RSS Source URL.
     *
     * @returns {Source} The new source.
     */
    async addSource (url) {
      try {
        // 1. Validate the source url by making a request
        // If the RSS parser is not able to parse the response,
        // the we do not accept this source.
        await fetchRss(url)
      } catch (e) {
        const err = new Error(`Invalid RSS source: "${url}"`)
        err.code = 'HC_RSS-SOURCE_INVALID'
        err.originalError = e

        throw err
      }

      // 2. Add the RSS source
      const fields = { source: url }
      const [id] = await rssRepository.create(fields)

      return this.source(id)
    },

    /**
     * Deletes a source from the rss repository.
     *
     * @param {Number} id - The id of the source to delete.
     */
    async deleteSource (id) {
      await rssRepository.delete(id)

      return { id }
    },

    /**
     * Fetches all sources from the RSS repository.
     *
     * @returns {Source[]} The sources.
     */
    async sources () {
      const sources = await rssRepository.sources()

      return sources.map(formatSource)
    },

    /**
     * Fetches a source by id in the RSS repository.
     *
     * @param {Number} id - The id of the source to fetch.
     *
     * @returns {Source} The source.
     */
    async source (id) {
      const source = await rssRepository.source(id)

      if (!source) {
        const err = new Error(`Source "${id}" was not found`)
        err.code = 'HC_RSS-SOURCE_NOT_FOUND'

        throw err
      }

      return formatSource(source)
    },

    /**
     * Aggregates all the RSS sources into a single feed.
     *
     * @returns {FeedItem[]} - The user feed.
     */
    async feed () {
      const sources = await rssRepository.sources()
      const channels = await Promise.all(
        sources.map(async ({ id, source }) => {
          try {
            const result = await fetchRss(source)

            return { sourceId: id, ...result }
          } catch (err) {
            // The current RSS source failed.
            return null
          }
        })
      )

      // Remove invalid RSS channels that returned null
      const validChannels = channels.map(x => x !== null)

      // Flatten all channels into a single list of
      // items.
      const feed = flatten(
        channels.map(({ sourceId, feed }) => {
          const channelTitle = feed.title

          return feed.entries.map(({ title, link, pubDate }) => ({
            title,
            link,
            date: pubDate,
            sourceId,
            source: channelTitle
          }))
        })
      )

      return feed
    }
  }
}
