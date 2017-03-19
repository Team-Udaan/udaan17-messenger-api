module.exports = connection => (req, res, next) => {

  const {round, participationIds, time, venue, event} = req.body

  // Missing round
  if (!round) {
    res.json({success: false, error: 'Missing round.'})
    return
  }

  // Missing participationIds
  if (!participationIds) {
    res.json({success: false, error: 'Missing participationIds.'})
    return
  }

  // Missing time
  if (!time) {
    res.json({success: false, error: 'Missing time.'})
    return
  }

  // Missing venue
  if (!venue) {
    res.json({success: false, error: 'Missing venue.'})
    return
  }

  // Invalid time
  if (isNaN(Date.parse(time))) {
    res.json({success: false, error: 'Invalid time.'})
    return
  }

  // Invalid venue
  if (typeof venue != 'string' || venue.length > 40) {
    res.json({success: false, error: 'Invalid venue.'})
    return
  }

  connection.query('SELECT round FROM events WHERE name = ?', [event], (_, results) => {

    // Invalid round
    if (round != results[0].round + 1) {
      res.json({success: false, error: 'Invalid round.'})
      return
    }

    connection.query('SELECT * FROM participations WHERE id IN (?)', [participationIds], (_, results) => {

      // Invalid participationIds
      if (results.length != participationIds.length || results.find(result => result.status.length + 1 != round)
        || results.find(result => result.event != event)) {
        res.json({success: false, error: 'Invalid participationIds.'})
        return
      }

      req.body.participations = results
      next()
    })
  })
}
