const assert = require('assert')
const qs = require('qs')
const axios = require('axios')
const Api = require('./Api')
const format = require('./format')

module.exports = () => {
  const BRIDGE_URI = process.env.DOMOTICZ_URI
  assert(
    BRIDGE_URI,
    'Environment variable "DOMOTICZ_URI" is required for module LightsDomiticz'
  )

  const domoticz = Api({ bridgeUri: BRIDGE_URI })

  return {
    lights: async () => (await domoticz.lights()).map(format.light),

    light: async lightId => format.light(await domoticz.light(lightId)),

    toggleLight: async (lightId, isOn) =>
      format.light(await domoticz.turn(lightId, isOn)),

    updateLight: async (lightId, { bri }) =>
      format.light(await domoticz.brightness(lightId, bri))
  }
}
