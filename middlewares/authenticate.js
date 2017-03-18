const crypto = require('crypto')

module.exports = (config, eventManagers) => (req, res, next) => {

  // Bypass Login
  if (config.bypassLogin) {
    next()
    return
  }

  // Missing credentials
  if (!req.body.email || !req.body.password) {
    res.json({success: false, error: 'Missing credentials.'})
    return
  }

  // Invalid Email
  if (!eventManagers[req.body.email]) {
    res.json({success: false, error: 'Incorrect email.'})
    return
  }

  // Invalid Password
  const hmac = crypto.createHmac('sha256', config.secret)
  hmac.update(req.body.email)
  if (hmac.digest('hex').slice(0, 8) != req.body.password) {
    res.json({success: false, error: 'Incorrect password.'})
    return
  }

  req.body.event = eventManagers[req.body.email]
  next()
}
