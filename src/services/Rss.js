const { promisify } = require('util')
const parser = require('rss-parser')
const flatten = require('array-flatten')

const fetchRss = promisify(parser.parseURL)

module.exports = ({ rssRepository }) => {
  return {
    feed: async () => {
      const sources = await rssRepository.findSources()
      const channels = await Promise.all(
        sources.map(({ source }) => fetchRss(source))
      )

      const feed = flatten(
        channels.map(({ feed }) => {
          const channelTitle = feed.title

          return feed.entries.map(({ title, link, pubDate }) => ({
            title,
            link,
            date: pubDate,
            source: channelTitle
          }))
        })
      )

      return feed
    }
  }
}
