module.exports = connection => (req, res) => {
  const {number, status, customID, datetime} = req.body,
    event = customID.slice(0, customID.length - 2),
    round = customID[customID.length - 1]
  console.info(req.body)
  res.end()
}
