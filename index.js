var express = require('express')
var path = require('path')
const request = require('request')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse

// VARS
const twiml = new MessagingResponse()
var app = express()

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/receive', function (req, res) {
  // assuming app has long lat of user
  console.log(req.body.Body)
  var params = req.body.Body.split(' ')
  var addressb4 = req.body.Body.split('.')
  var address = addressb4[1].replace(/ /g, '+')

  if (addressb4[0] === 'va_assist') {
    var long
    var lat

    const sourceAddress = address
    const key = 'AIzaSyDx7W32E_T6H5fmVjwLDyGnqTWkySCTJAE'

    const options = {
      method: 'GET',
      url:
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        sourceAddress +
        '&key=' +
        key
    }
    console.log('proceeded')
    request(options, function (error, response, body) {
      if (error) throw new Error(error)

      var result = JSON.parse(body)
      var result2 = result.results[0].geometry.location

      console.log(result2)
      long = result2.lng
      lat = result2.lat

      console.log('now make http request')

      var options2 = {
        method: 'GET',
        url: 'https://dev-api.va.gov/services/va_facilities/v0/facilities',
        qs: { apikey: 'BGZMwn7elWRPHlxknLOYEFVU3bP2RWqD', long: long, lat: lat }
      }

      request(options2, function (error, response, body) {
        if (error) throw new Error(error)
        var result = JSON.parse(body)
        var textmsg = 'Nearby VA facilities are as follows \n'
        console.log(result)
        /* for(let i = 0 ; i < 5 ; i++){
            textmsg +=  result.data[i].attributes.name +"\n"
          } */

        // console.log(body.data[0].attributes.name);
      })
    })
  }
})

app.post('/api/signup', function (req, res) {
  console.log(req.body.user.name)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/login/login.html'))
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/login/signup.html'))
})

app.post('/api/signup', function (req, res) {
  console.log(req.body)
})

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
})

app.listen(5000, function () {
  console.log('Example app listening on port 5000!')
})
