const https = require('https')
const express = require('express')
const mysql = require('mysql')
const path = require('path')
const fs = require('fs')
const config = require('./config.json')

const connection = mysql.createConnection(config.connection)

const app = express()

const cors = require('cors')()
const json = require('body-parser').json()
const urlencoded = require('body-parser').urlencoded({extended: true})

let eventManagers = {}

const authenticate = require('./middlewares/authenticate')(config, eventManagers)
const data = require('./endpoints/data')(connection)
const validatePromotion = require('./middlewares/validatePromotion')(connection)
const promote = require('./endpoints/promote')(config, connection)
const textLocal = require('./endpoints/textLocal')(connection)
const textLocalRound = require('./endpoints/textLocalRound')(connection)

app.use(cors)

app.options((_, res) => res.end())
app.post('/data', json, authenticate, data)
app.post('/promote', json, authenticate, validatePromotion, promote)
app.post('/text-local', urlencoded, textLocal)
app.post('/text-local/round', urlencoded, textLocalRound)

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
