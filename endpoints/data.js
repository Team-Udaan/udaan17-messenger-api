module.exports = connection => (req, res) => {
  const event = req.body.event
  connection.query('SELECT round FROM events WHERE name = ?', [event], (_, results) => {
    const round = results[0].round
    connection.query('SELECT * FROM participations WHERE event = ? ', [event], (_, results) => {
      const participations = results.filter(result => result.status.length == round)
      res.json({event, round, participations})
    })
  })
}
