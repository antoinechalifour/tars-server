const assert = require('assert')
const { promisify } = require('util')
const google = require('googleapis')
const format = require('./format')

module.exports = function GoogleCalendarService ({ logging }) {
  const logger = logging.getLogger('services.calendar.google')
  logger.info('Creating service.')
  const CREDENTIALS_FILE = process.env.GOOGLE_CALENDAR_CREDENTIALS
  const TOKEN = process.env.GOOGLE_CALENDAR_TOKEN

  assert(
    CREDENTIALS_FILE,
    'Environment variable "GOOGLE_CALENDAR_CREDENTIALS" is required for module Calendar/Google'
  )
  assert(
    TOKEN,
    'Environment variable "GOOGLE_CALENDAR_TOKEN" is required for module Calendar/Google'
  )

  const credentials = require(CREDENTIALS_FILE)
  const oauth2Client = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  )

  oauth2Client.credentials = {
    refresh_token: TOKEN
  }

  const authReady = new Promise((resolve, reject) => {
    logger.debug('Trying to fetch credentials using environment token', {
      refresh_token: TOKEN
    })
    oauth2Client.refreshAccessToken(err => {
      if (err) {
        logger.error(err.message, err)
        reject(err)
      } else {
        logger.debug('Access token has been set.')
        resolve()
      }
    })
  })

  google.options({
    auth: oauth2Client
  })

  const whenReady = fn => async (...args) => {
    await authReady

    return fn(...args)
  }

  return {
    events: whenReady(async function events () {
      logger.debug('Calling Google API')
      const calendarApi = google.calendar('v3')
      const events = await promisify(calendarApi.events.list)({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })
      logger.debug('Done.')

      return {
        events: events.items.map(format.event)
      }
    })
  }
}
