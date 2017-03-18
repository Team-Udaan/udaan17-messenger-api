module.exports = connection => (req, res, next) => {

  // Missing round
  if (!req.body.round) {
    res.json({success: false, error: 'Missing round.'})
    return
  }

  // Missing participationIds
  if (!req.body.participationIds) {
    res.json({success: false, error: 'Missing participationIds.'})
    return
  }

  connection.query('SELECT round FROM events WHERE name = ?', [req.body.event], (_, results) => {

    // Invalid round
    if (req.body.round != results[0].round + 1) {
      res.json({success: false, error: 'Invalid round.'})
      return
    }

    connection.query('SELECT * FROM participations WHERE id IN (?)', [req.body.participationIds], (_, results) => {

      // Invalid participationIds
      if (results.find(result => result.status.length + 1 != req.body.round)
        || results.length != req.body.participationIds.length) {
        res.json({success: false, error: 'Invalid participationIds.'})
        return
      }

      req.body.participations = results
      next()
    })
  })
}
