module.exports.event = function (event) {
  return {
    id: event.id.toString(),
    type: event.type,
    date: new Date(event.fired_at),
    payload: event.data
  }
}
