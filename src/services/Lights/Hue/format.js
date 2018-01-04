/**
 * @typedef HueLight A Philips Hue light.
 * @property {String} id - The light id.
 * @property {String} type - The light type.
 * @property {String} name - The light name.
 * @property {Object} state - The current light state.
 * @property {Boolean} state.on - True is the light is on.
 * @property {Number} state.bri - The current light brightness
 */

/**
 * Format a Hue light to a GraphQL compatible format.
 *
 * @param {HueLight} light
 * @returns {Light}
 */
module.exports.light = function formatLight (light) {
  const type = light.type.toLowerCase()
  const baseFields = {
    id: light.id,
    name: light.name
  }
  const additionalFields = {}

  if (type === 'dimmable light') {
    additionalFields.type = 'dimmer'
    additionalFields.status = light.state.on ? 'on' : 'off'
    additionalFields.bri = light.state.bri
  }

  return Object.assign(baseFields, additionalFields)
}
