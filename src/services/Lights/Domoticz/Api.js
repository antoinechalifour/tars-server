const qs = require('qs')
const axios = require('axios')

module.exports = function DomoticzApi ({ bridgeUri }) {
  const _request = async params =>
    (await axios.get(`${bridgeUri}/json.htm?${qs.stringify(params)}`)).data

  return {
    /**
     * Fetches the available physical lights.
     *
     * @returns {Promise<DomoticZLight[]>} - The available DomoticZ lights.
     */
    async lights () {
      const response = await _request({
        type: 'devices',
        filter: 'light',
        // FIXME: Somehow removing this parameter changes Domoticz response
        // and adds "virtual" devices ?
        used: true
      })

      // Why must HardwareTypeVal be set to 21 ?
      // TODO: Dive into Domoticz to understand whasup
      return response.result.filter(x => x.HardwareTypeVal === 21)
    },

    /**
     * Fetches information about a specific light.
     *
     * @param {String} lightId The light Id.
     *
     * @returns {Promise<DomoticZLight>} - The light information.
     */
    async light (lightId) {
      const response = await _request({
        type: 'devices',
        rid: lightId
      })

      return response.result[0]
    },

    /**
     * Turns on / off a light (for "switch" light type).
     *
     * @param {String} lightId - The light to switch.
     * @param {Boolean} isOn - Whether the light must be turned on.
     *
     * @returns {Promise<DomoticZLight>} - The updated domoticz light.
     */
    async turn (lightId, isOn) {
      await _request({
        type: 'command',
        param: 'switchlight',
        idx: lightId,
        switchcmd: isOn ? 'On' : 'Off'
      })

      return this.light(lightId)
    },

    /**
     * Changes the brightness of a light (for "dimmer" light type).
     *
     * @param {String} lightId - The light id.
     * @param {Int} brightness - The brightness level in range [0, 100].
     *
     * @returns {Promise<DomoticZLight>} - The updated domoticz light.
     */
    async brightness (lightId, brightness) {
      await _request({
        type: 'command',
        param: 'switchlight',
        idx: lightId,
        switchcmd: 'Set Level',
        level: brightness
      })

      return this.light(lightId)
    },

    /**
     * Updates a specific device by its id.
     * @param {Stirng} lightId - The light id.
     * @param {Object} updates - The updates to apply.
     * @param {String} updates.name - The new device name.
     */
    async update (lightId, updates) {
      const options = {
        type: 'setused',
        idx: lightId,
        switchtype: 0, // TODO: Figure out what this is ??
        used: true // TODO: Figure out what this is ??
      }

      if (updates.name) {
        options.name = updates.name
      }

      if (updates.description) {
        options.description = updates.description
      }

      await _request(options)

      return this.light(lightId)
    }
  }
}
