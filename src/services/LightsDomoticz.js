const assert = require('assert')
const qs = require('qs')
const axios = require('axios')

module.exports = () => {
  const BRIDGE_URI = process.env.DOMOTICZ_URI
  assert(
    BRIDGE_URI,
    'Environment variable "DOMOTICZ_URI" is required for module LightsDomiticz'
  )

  return {
    lights: async () => {
      // TODO: Figure out these params ?????
      const params = {
        type: 'devices',
        filter: 'light',
        used: true
      }
      const response = await axios.get(
        `${BRIDGE_URI}/json.htm?${qs.stringify(params)}`
      )
      const data = response.data
      const types = {
        'On/Off': 'switch',
        Dimmer: 'dimmer'
      }

      // TODO: Understand what to filter ???
      return data.result.filter(x => x.HardwareTypeVal === 21).map(x => ({
        id: x.idx,
        name: x.Name,
        type: types[x.SwitchType],
        status: x.Status === 'On' ? 'on' : 'off',
        bri: x.Level
      }))
    },

    toggleLight: async (lightId, isOn) => {
      try {
        const nextStatus = isOn ? 'On' : 'Off'
        const params = {
          type: 'command',
          param: 'switchlight',
          idx: lightId,
          switchcmd: nextStatus
        }

        await axios.get(`${BRIDGE_URI}/json.htm?${qs.stringify(params)}`)

        // TODO: Return the correct device information
        return { name: 'toto' }
      } catch (err) {
        // TODO: Handle errors
        return null
      }
    },

    updateLight: async (lightId, { bri }) => {
      try {
        const params = {
          type: 'command',
          param: 'switchlight',
          idx: lightId,
          switchcmd: 'Set Level',
          level: bri
        }

        await axios.get(`${BRIDGE_URI}/json.htm?${qs.stringify(params)}`)

        // TODO: Return the correct device information
        return { id: 0 }
      } catch (err) {
        // TODO: Handle errors
        return null
      }
    }
  }
}
