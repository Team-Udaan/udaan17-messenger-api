module.exports = connection => (req, res) => {
  connection.query('INSERT INTO delivery_receipts VALUES (?)', [JSON.stringify(req.body)], () => {
    res.end()
  })
}
