const crypto = require('crypto')

module.exports = (config, eventManagers) => (req, res, next) => {

  // Missing email
  if (!req.body.email) {
    res.json({success: false, error: 'Missing email.'})
    return
  }

  // Missing password
  if (!req.body.password) {
    res.json({success: false, error: 'Missing password.'})
    return
  }

  // Invalid Email
  if (!eventManagers[req.body.email]) {
    res.json({success: false, error: 'Invalid email.'})
    return
  }

  // Invalid Password
  const hmac = crypto.createHmac('sha256', config.secret)
  hmac.update(req.body.email)
  if (hmac.digest('hex').slice(0, 8) != req.body.password) {
    res.json({success: false, error: 'Invalid password.'})
    return
  }

  req.body.event = eventManagers[req.body.email]
  next()
}
