const createService = require('./createService')

module.exports = createService('list', [
  'created',
  'updated',
  'deleted',
  'item.created',
  'item.updated',
  'item.deleted',
  'item.status'
])
