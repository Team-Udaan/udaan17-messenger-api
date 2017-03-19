const request = require('request')
const moment = require('moment')

module.exports = (config, connection) => (req, res) => {

  const {round, event, time, venue, participations} = req.body

  // Update current round
  connection.query('UPDATE events SET round = ? WHERE name = ?', [round, event], () => {

    // Update statuses
    const queries = participations.map(participation => connection.format(
      'UPDATE participations SET status = ? WHERE id = ?;', [participation.status + '!', participation.id]
    ))
    connection.query(queries.join(''), () => {

      // Send texts
      const {test, username, hash, sender} = config.sms
      request.post({
        url: 'http://api.textlocal.in/send/',
        form: {
          test,
          custom: event + round,
          username,
          hash,
          sender,
          numbers: participations.map(participation => participation.mobile).join(','),
          message: `Dear Participant, Round ${round} of ${event} is on ${
            moment(time).format('DD-MM-YYYY hh:mm A')} at ${venue}.Kindly be present at the venue on time.`,
          receipt_url: config.sms.receiptUrls.round
        }
      }, (_, response) => {
        console.log(response)
        res.json({success: true})
      })

    })
  })
}
