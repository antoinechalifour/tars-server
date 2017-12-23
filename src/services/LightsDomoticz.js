const assert = require('assert')

const axios = require('axios')

module.exports = () => {
  const BRIDGE_URI = process.env.DOMOTICZ_URI
  assert(
    BRIDGE_URI,
    'Environment variable "DOMOTICZ_URI" is required for module LightsDomiticz'
  )

  return {
    lights: async () => {
      const response = await axios.get(
        `${BRIDGE_URI}/json.htm?type=devices&filter=light&used=true&order=[Order]&plan=0`
      )
      const data = response.data

      const types = {
        'Light/Switch': 'switch',
        'Lighting 1': 'switch'
      }

      return data.result.filter(x => x.HardwareTypeVal === 21).map(x => ({
        id: x.idx,
        name: x.Name,
        type: types[x.Type],
        status: x.Status === 'On' ? 'on' : 'off'
      }))
    },

    toggleLight: async (lightId, isOn) => {
      try {
        const nextStatus = isOn ? 'On' : 'Off'
        await axios.get(
          `${BRIDGE_URI}/json.htm?type=command&param=switchlight&idx=${lightId}&switchcmd=${nextStatus}&level=0&passcode=`
        )
        return { name: 'toto' }
      } catch (err) {
        return null
      }
    }
  }
}
