const axios = require('axios')

module.exports = function HueApi ({ bridges = [] }) {
  const _callBridges = createRequest =>
    Promise.all(
      bridges.map(({ uri, user }) =>
        createRequest(path => `${uri}/api/${user}${path}`)
      )
    )

  // FIXME: For multiple bridges ? (Cannot test it as of 4/1/2018)
  const _updateLightState = (lightId, updates) =>
    _callBridges(getFullUri =>
      axios
        .put(getFullUri(`/lights/${lightId}/state`), updates)
        .then(response => response.data)
    )

  return {
    /**
     * Fetches available lights.
     *
     * @returns {Promise<HueLight[]>} - The available Hue lights.
     */
    async lights () {
      const responses = await _callBridges(getFullUri =>
        axios.get(getFullUri('/lights')).then(response => response.data)
      )

      const lights = responses.reduce((concat, bridgeResponse) => {
        const bridgeLights = Object.keys(bridgeResponse).map(numericalId =>
          Object.assign({}, bridgeResponse[numericalId], {
            id: numericalId
          })
        )

        return [...concat, ...bridgeLights]
      }, [])

      return lights
    },

    /**
     * Fetches information about a specific light.
     * @param {String} lightId - The light id.
     */
    async light (lightId) {
      const responses = await _callBridges(getFullUri =>
        axios
          .get(getFullUri(`/lights/${lightId}`))
          .then(response => response.data)
      )

      const light = responses.find(x => Boolean(x))

      return Object.assign({}, light, { id: lightId })
    },

    /**
     * Turns on / off a light.
     *
     * @param {String} lightId - The light id.
     * @param {Boolean} isOn - Whether the light must be turned on.
     */
    async turn (lightId, isOn) {
      await _updateLightState(lightId, { on: isOn })

      return this.light(lightId)
    },

    /**
     * Changes the brightness of a light.
     *
     * @param {String} lightId - The light id.
     * @param {Number} brightness - The brightness level in range [0, 100]
     */
    async brightness (lightId, brightness) {
      // Hue lights have a brightness in range [0, 255] and our API
      // uses range [0, 100] so we need to de-normalize it.
      const hueBrightness = Math.round(brightness / 100 * 255)

      await _updateLightState(lightId, { bri: hueBrightness })

      return this.light(lightId)
    },

    /**
     * Updates a specific device by its id.
     *
     * @param {String} lightId - The light id.
     * @param {Object} updates - The updates to apply.
     * @param {String} updates.name - The new device name.
     */
    async update (lightId, updates) {
      const options = {}

      if (updates.name) {
        options.name = updates.name
      }

      await _callBridges(getFullUri =>
        axios
          .put(getFullUri(`/lights/${lightId}`), options)
          .then(response => response.data)
      )

      return this.light(lightId)
    }
  }
}
