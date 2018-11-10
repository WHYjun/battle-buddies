var express = require('express')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse

// VARS
const twiml = new MessagingResponse()
var app = express()

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/receive', function (req, res) {
  console.log('SMS is:' + req.body.Body)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
