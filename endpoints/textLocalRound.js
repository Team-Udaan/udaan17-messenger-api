module.exports = connection => (req, res) => {
  const {number, status, customID, datetime} = req.body,
    mobile = number.slice(2),
    event = customID.slice(0, customID.length - 1),
    round = customID[customID.length - 1]
  connection.query('SELECT status FROM participations WHERE mobile = ? AND event = ?', [mobile, event], (_, results) => {
    let updatedStatus = results[0].status.split('')
    updatedStatus.splice(round - 1, 1, status)
    connection.query('UPDATE participations SET status = ? WHERE mobile = ? AND event = ?', [
      updatedStatus.join(''), mobile, event
    ], () => {
      res.end()
    })
  })
}
