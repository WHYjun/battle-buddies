var express = require('express')
const axios = require ('axios')
const request = require ('request')
const accountSid = 'ACa9129633d27ef3500b23dfae414977cf';
const authToken = '68fb77df16d1defb3bb9744da131eed1';
var client = require('twilio')(accountSid, authToken);
const superagent = require('superagent')
const https = require('https')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse

// VARS

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
  var addressb4 = req.body.Body.split(".");
  var address = addressb4[1].replace(/ /g, "+");

  
  if(addressb4[0] == "va_assist"){

    var long;
    var lat;

    const sourceAddress = address;
    const key = "AIzaSyDx7W32E_T6H5fmVjwLDyGnqTWkySCTJAE";

    const options = { method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + sourceAddress + '&key=' + key
    };
    console.log('proceeded');
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        result = JSON.parse(body)
        result2 = result.results[0].geometry.location

        console.log(result2)
        long = result2.lng;
        lat = result2.lat;

        console.log("now make http request");

        var options2 = { method: 'GET',
        url: 'https://dev-api.va.gov/services/va_facilities/v0/facilities',
        qs: 
        { apikey: 'BGZMwn7elWRPHlxknLOYEFVU3bP2RWqD',
          long: long,
          lat: lat }
        };
      
        request(options2, function (error, response, body) {
          if (error) throw new Error(error);
          var result = JSON.parse(body)
          var textmsg = "Nearby VA facilities are as follows \n"
          console.log(result)
          for(let i = 0 ; i < 5 ; i++){
            textmsg +=  result.data[i].attributes.name +"\n"
          }
          //const twiml = new MessagingResponse()

          client.messages
          .create({
              body: textmsg,
              from: '',
              to: ''
          })
          .then(message => console.log(message.sid))
          .done();
          
          //console.log(body.data[0].attributes.name);
        });
  
    });

  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/api/signup', function (req, res) {
  console.log(req.body.user.name)
})
