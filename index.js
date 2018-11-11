var express = require('express')
var path = require('path')
const request = require('request')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const mongoose = require('mongoose')
const User = require('./user')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/battle-buddies')

// VARS
var app = express()

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/receive', async function (req, res) {
  // assuming app has long lat of user
  console.log(req.body.Body)
  var addressb4 = req.body.Body.split('.')

  const twiml = new MessagingResponse()
  if (addressb4[0] === 'TXTFORVETS') {
    twiml.message('Hello! \nWhat kind of assistance do you need?\n(Health, Job Assistance)')
  } else if (addressb4[0] === 'Health') {
    twiml.message('Where are you located?')
  } else if (addressb4[0] === 'Job Assistance') {
    twiml.message('Where are you located?')
  } else {
    var address = req.body.Body.replace(/ /g, '+')

    const sourceAddress = address
    const key = ''

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
      var long = result2.lat
      var lat = result2.lng

      console.log('now make http request')

      var options2 = {
        method: 'GET',
        url: 'https://dev-api.va.gov/services/va_facilities/v0/facilities',
        qs: { apikey: '', long: long, lat: lat }
      }

      request(options2, function (error, response, body) {
        if (error) throw new Error(error)
        var result = JSON.parse(body)
        var textmsg = 'Nearby VA facilities are as follows: \n'
        console.log(result)
        for (let i = 0; i < 5; i++) {
          textmsg +=
            result.data[i].attributes.name +
            '\n' +
            ': ' +
            result.data[i].attributes.phone.main +
            '\n'
        }
        const twiml = new MessagingResponse()
        console.log(textmsg)
        twiml.message(textmsg)
        console.log('hi')
        res.writeHead(200, {'Content-Type': 'text/xml'})
        res.end(twiml.toString())
      })
    })
  }
  if (addressb4[0] === 'TXTFORVETS' || addressb4[0] === 'Health' || addressb4[0] === 'Job Assistance') {
    console.log('hello')
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
  }
})

app.post('/api/signup', async function (req, res) {
  var result = {}
  result['email'] = req.body.email
  result['name'] = req.body.name
  result['password'] = req.body.password
  var dob = req.body.day + req.body.month + req.body.year
  result['dob'] = dob
  result['gender'] = req.body.gender
  var address = req.body.address + ' ' + req.body.city + ' ' + req.body.state
  result['address'] = address
  result['specialty'] = req.body.specialty
  result['branch'] = req.body.branch
  result['memberid'] = req.body.member
  result['planid'] = req.body.plan

  const newUser = await new User(result)
  await newUser.save()

  res.sendFile(path.join(__dirname, 'client/login/login.html'))
})

app.post('/api/signin', (req, res) => {
  var email = req.body.email
  var password = req.body.password

  User.findOne({ email: email, password: password }, (err, docs) => {
    if (err) throw new Error(err)
    if (!docs) {
      res.sendFile(path.join(__dirname, 'client/login/login.html'))
    } else {
      res.sendFile(path.join(__dirname, 'client/board/board.html'))
    }
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/login/login.html'))
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/login/signup.html'))
})

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' })
})

app.listen(5000, function () {
  console.log('Example app listening on port 5000!')
})
