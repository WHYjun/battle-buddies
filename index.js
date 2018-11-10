var express = require('express')
var client = require('twilio')(
  'ACa9129633d27ef3500b23dfae414977cf',
  'p68fb77df16d1defb3bb9744da131eed1'
);
const axios = require ('axios')
const request = require ('request')

const superagent = require('superagent')
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

  if(params[0] == "va_assist"){
    console.log("now make http request");

    var APIKEY = "BGZMwn7elWRPHlxknLOYEFVU3bP2RWqD";
    var long = 42.349416;
    var lat = -71.106412;


    var options = { method: 'GET',
    url: 'https://dev-api.va.gov/services/va_facilities/v0/facilities',
    qs: 
     { apikey: 'BGZMwn7elWRPHlxknLOYEFVU3bP2RWqD',
       long: '42.349416',
       lat: '-71.106412' }
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var result = JSON.parse(body)
      var textmsg = "Nearby VA facilities are as follows \n"
      for(let i = 0 ; i < 5 ; i++){
        textmsg +=  result.data[0].attributes.name +"\n"
      }

      client.messages.create({
        from: 8572038387,
        to: 7819520510,
        body: textmsg
      }).then((message) => console.log(message.sid));
      //console.log(body.data[0].attributes.name);
    });


  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/api/signup', function (req, res) {
  console.log(req.body.user.name)
})
