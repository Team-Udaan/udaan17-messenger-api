const https = require('https')
const express = require('express')
const mysql = require('mysql')
const path = require('path')
const fs = require('fs')
const config = require('./config.json')

const connection = mysql.createConnection(config.connection)

const app = express()

const cors = require('cors')()
const bodyParser = require('body-parser').json()

let eventManagers = {}

const optionHeaders = require('./endpoints/optionHeaders')
const authenticate = require('./middlewares/authenticate')(config, eventManagers)
const data = require('./endpoints/data')(connection)
const validatePromotion = require('./middlewares/validatePromotion')(connection)
const promote = require('./endpoints/promote')
const textLocal = require('./endpoints/textLocal')(config)

app.use(cors)
app.use(bodyParser)

app.options(['/data', '/promote'], optionHeaders)
app.post('/data', authenticate, data)
app.post('/promote', authenticate, validatePromotion, promote)
app.post('/text-local', textLocal)

const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, config.server.key)),
  cert: fs.readFileSync(path.join(__dirname, config.server.cert)),
  ca: fs.readFileSync(path.join(__dirname, config.server.ca))
}, app)

connection.connect(() => {
  console.log(`Connected to ${
    config.connection.user}:${
    config.connection.password}@${
    config.connection.host}/${
    config.connection.database}`
  )
  connection.query('SELECT * FROM event_managers', (_, results) => {
    results.forEach(result => eventManagers[result.email] = result.event)

    server.listen(config.server.port, () => {
      console.log(`Serving from ${config.server.port}`)
    })
  })
})
