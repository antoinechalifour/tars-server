const { promisify } = require('util')
const parser = require('rss-parser')
const flatten = require('array-flatten')

const fetchRss = promisify(parser.parseURL)

module.exports = ({ rssRepository }) => {
  return {
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

    async deleteSource (id) {
      await rssRepository.delete(id)

      return { id }
    },

    async source (id) {
      const source = await rssRepository.source(id)
      const result = { ...source }

      result.url = result.source
      delete result.source

      return result
    },

    async feed () {
      const sources = await rssRepository.findSources()
      // TODO: Handle dependencies failures
      const channels = await Promise.all(
        sources.map(async ({ id, source }) => {
          const result = await fetchRss(source)

          return { sourceId: id, ...result }
        })
      )

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
