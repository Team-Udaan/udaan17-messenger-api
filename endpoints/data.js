module.exports = connection => (req, res) => {
  const {event} = req.body
  connection.query('SELECT round FROM events WHERE name = ?', [event], (_, results) => {
    const {round} = results[0]
    connection.query('SELECT * FROM participations WHERE event = ? AND length(status) = ?', [event, round], (_, participations) => {
      res.json({success: true, event, round, participations})
    })
  })
}
