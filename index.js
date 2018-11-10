var express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse

// VARS
const twiml = new MessagingResponse()
var app = express()

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/receive', function (req, res) {

  //assuming app has long lat of user 
  console.log(req.body.Body);
  var params = req.body.Body.split(" ");

  if(params[0] == "va_")
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/api/signup', function (req, res) {
  console.log(req.body.user.name)
})
