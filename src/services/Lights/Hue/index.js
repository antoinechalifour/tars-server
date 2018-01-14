const assert = require('assert')
const Api = require('./Api')
const format = require('./format')

module.exports = function HueLightsService ({ logging, lightsEvents }) {
  const logger = logging.getLogger('services.lights.hue')
  logger.info('Creating service.')
  const BRIDGE_URI = process.env.HUE_BRIDGE_URI
  const BRIDGE_USER = process.env.HUE_BRIDGE_USER

  assert(
    BRIDGE_URI,
    'Environment variable "HUE_BRIDGE_URI" is required for module HueLights'
  )
  assert(
    BRIDGE_USER,
    'Environment variable "HUE_BRIDGE_USER" is required for module HueLights'
  )

  const hue = Api({
    logger: logging.getLogger('services.lights.hue.api'),
    bridges: [
      {
        uri: BRIDGE_URI,
        user: BRIDGE_USER
      }
    ]
  })

  return {
    lights: async () => (await hue.lights()).map(format.light),

    light: async lightId => format.light(await hue.light(lightId)),

    toggleLight: async (lightId, isOn) => {
      const light = format.light(await hue.turn(lightId, isOn))

      lightsEvents.status(light)
    },

    updateLight: async (lightId, { bri, name }) => {
      const events = []

      if (typeof bri === 'number') {
        await hue.brightness(lightId, bri)
        const date = new Date()
        events.push(light => lightsEvents.brightness(light, date))
      }

      if (name) {
        await hue.update(lightId, { name })
        const date = new Date()
        events.push(light => lightsEvents.information(light, date))
      }

      const light = format.light(await hue.light(lightId))

      events.forEach(fn => fn(light))

      return light
    }
  }
}
