const assert = require('assert')
const axios = require('axios')

module.exports = function ({ logging, lightsService }) {
  const logger = logging.getLogger('services.nlp.wit')
  logger.info('Creating service')
  const WIT_TOKEN = process.env.WIT_AI_TOKEN

  assert(
    WIT_TOKEN,
    'Environment variable "WIT_AI_TOKEN" is required for module HueLights'
  )

  const lookupTable = {
    'lights:on': async () => {
      const lights = await lightsService.lights()

      for (const light of lights) {
        await lightsService.toggleLight(light.id, true)
      }

      return 'Lights have been turned on.'
    },
    'lights:off': async () => {
      const lights = await lightsService.lights()

      for (const light of lights) {
        await lightsService.toggleLight(light.id, false)
      }

      return 'Lights have been turned off.'
    },
    'lights:bri': async response => {
      const lights = await lightsService.lights()
      const bri = response.entities.number[0].value

      for (const light of lights) {
        await lightsService.updateLight(light.id, {
          bri
        })
      }

      return `Lights have been set to ${bri} percent`
    }
  }

  return {
    process: async query => {
      const response = await axios.get(
        `https://api.wit.ai/message?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${WIT_TOKEN}`
          }
        }
      )

      if (
        !response.data.entities.intent ||
        response.data.entities.intent.length === 0
      ) {
        return "Sorry, didn't get that"
      }

      const [intent] = response.data.entities.intent

      if (lookupTable[intent.value]) {
        return lookupTable[intent.value](response.data)
      } else {
        return "Sorry, didn't get that"
      }
    }
  }
}
