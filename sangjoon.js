var express = require('express')
const bodyParser = require('body-parser')
const request = require("request-promise");
const MessagingResponse = require('twilio').twiml.MessagingResponse
const router = express.Router();

// VARS
const twiml = new MessagingResponse()
var app = express()

app.get('/', function(req, res){
    const request = require("request");
    const sourceAddress = "775+Commonwealth+Avenue,+Boston,+MA";
    const key = "AIzaSyDx7W32E_T6H5fmVjwLDyGnqTWkySCTJAE";

    const options = { method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + sourceAddress + '&key=' + key
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        result = JSON.parse(body)
        result2 = result.results[0].geometry.location
        res.json(result2)
    });


})

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// app.get('/', function (req, res) {
//   res.send()
// })

app.post('/receive', function (req, res) {
  console.log('SMS is:' + req.body.Body)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/api/signup', function (req, res) {
  console.log(req.body.user.name)
})
