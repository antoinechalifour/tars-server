module.exports = function LightsEvents ({ events }) {
  const prefix = 'light'
  const methods = ['status', 'brightness', 'information']

  const service = {}

  methods.forEach(eventName => {
    service[eventName] = (light, date) => {
      if (!date) {
        date = new Date()
      }

      const logName = `${prefix}.${eventName}`

      events.record(logName, date, light)
    }
  })

  return service
}
