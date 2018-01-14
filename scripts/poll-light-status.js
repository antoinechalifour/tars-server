const hash = require('object-hash')

module.exports = function PollLightStatus (container) {
  const logging = container.resolve('logging')
  const pubSub = container.resolve('pubSub')
  const lightsService = container.resolve('lightsService')
  const cache = {}

  logger = logging.getLogger('scripts.poll-light-status')
  logger.info('Running script.')

  const pollStatus = async () => {
    const lights = await lightsService.lights()

    lights.forEach(light => {
      const newHash = hash(light)

      if (cache[light.id] !== newHash) {
        cache[light.id] = newHash
        pubSub.publish('lightUpdated', light)
      }
    })
  }
  ;(async function () {
    // Initialize the script
    // Fetch all lights and store their information
    // as a "hash".
    const lights = await lightsService.lights()

    lights.forEach(light => {
      cache[light.id] = hash(light)
    })

    // Start polling. After each step, compare the new hash
    // and publish an event if it has been changed
    setInterval(pollStatus, 5000)
  })()
}
