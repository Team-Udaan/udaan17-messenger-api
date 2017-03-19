module.exports = connection => (req, res) => {
  const {number, status, customID, datetime} = req.body,
    mobile = number.slice(2),
    event = customID.slice(0, customID.length - 2),
    round = customID[customID.length - 1]
  connection.query('SELECT status FROM participations WHERE mobile = ? AND event = ?', [mobile, event], (_, results) => {
    connection.query('UPDATE participations SET status = ? WHERE mobile = ? AND event = ?', [
      results[0].status.split('').splice(round, 1, status), mobile, event
    ], () => {
      res.end()
    })
  })
}
