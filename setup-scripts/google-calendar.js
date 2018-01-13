require('dotenv').config()
const assert = require('assert')
const readline = require('readline')
const google = require('googleapis')
const { OAuth2Client } = require('google-auth-library')
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
const CREDENTIALS_FILE = process.env.GOOGLE_CALENDAR_CREDENTIALS

assert(
  CREDENTIALS_FILE,
  'Environment variable "GOOGLE_CALENDAR_CREDENTIALS" is required to run this script'
)

const credentials = require(CREDENTIALS_FILE)
const oauth2Client = new OAuth2Client(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
)
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES
})
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log(`Authorize the app using this url: ${authUrl}`)

r1.question('Enter the code:', code => {
  r1.close()

  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.log('Error', err)
      return
    }

    console.log(
      `Add this token as "GOOGLE_CALENDAR_TOKEN" in your .env file: ${tokens.refresh_token}`
    )
  })
})
