// Don't really like this API...
// TODO: Change stuff

module.exports = `
  toggleLight (
    lightId: String,
    isOn: Boolean
  ) : Light

  updateLight (
    lightId: String,
    bri: Int
  ) : Light
`
