const assert = require('assert')
const Api = require('./Api')
const format = require('./format')

module.exports = function HueLightsService () {
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

    toggleLight: async (lightId, isOn) =>
      format.light(await hue.turn(lightId, isOn)),

    updateLight: async (lightId, { bri, name }) => {
      if (typeof bri === 'number') {
        await hue.brightness(lightId, bri)
      }

      if (name) {
        await hue.update(lightId, { name })
      }

      return format.light(await hue.light(lightId))
    }
  }
}
