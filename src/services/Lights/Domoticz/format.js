/**
 * @typedef DomoticZLight A DomoticZ light.
 * @property {String} light.idx - The light id.
 * @property {String} light.SwitchType - The light sub type.
 * @property {String} light.Name - The light name.
 * @property {String} light.Status - The light status.
 * @property {String} light.Level - The light brightness level.
 */

/**
  * @typedef Light A light.
  * @property {String} id - The light id.
  * @property {String} name - The light name.
  * @property {String} type - The light type.
  * @property {String} [status] - The light status (for "switch" type).
  * @property {String} [bri] - The light brightness (for "dimmer" type).
  */

/**
 * Format a DomoticZ light to a GraphQL compatible
 * format.
 *
 * @param {DomoticZLight} light - The light to format.
 * @returns {Light}
 */
module.exports.light = function formatLight (light) {
  const type = light.SwitchType.toLowerCase()
  const baseFields = {
    id: light.idx,
    name: light.Name
  }
  const additionalFields = {}

  if (type === 'on/off') {
    additionalFields.type = 'switch'
    additionalFields.status = light.Status === 'On' ? 'on' : 'off'
  } else if (type === 'dimmer') {
    additionalFields.type = 'dimmer'
    additionalFields.bri = light.Level
  }

  return Object.assign(baseFields, additionalFields)
}
