const googleUserToUser = user => ({
  name: user.displayName,
  email: user.email
})

module.exports.event = googleEvent => ({
  id: googleEvent.id,
  title: googleEvent.summary,
  start: googleEvent.start.dateTime,
  end: googleEvent.end.dateTime,
  link: googleEvent.link,
  organizer: googleUserToUser(googleEvent.organizer),
  attendees: googleEvent.attendees
    ? googleEvent.attendees.map(googleUserToUser)
    : []
})
