var express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/site-auth')
//require('./config/passport')
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
  console.log('SMS is:' + req.body.Body)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/api/signup', function (req, res) {
  console.log(req.body.user.name)
})

//middleware extended
//signin

//Middleware to handle views is set up; use of handlebars for views
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')

//middleware for bodyparser (already handled above), cookie, session, and passport.
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'codeworkrsecret',
    saveUninitialized: false,
    resave: false
}));

//Passport will be used when users want to log in.
app.use(passport.initialize())
app.use(passport.session())

// displaying flash messages; create the type of flash messages you want.
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_mesages = req.flash('success')
    res.locals.error_messages = req.flash('error')
    next()
})

//Routes middleware—this will handle any request made to a URL path.
//The URL paths specified here are for the index and users path.
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.render('notFound')
});

//server set to listen at port 3000
//app.listen(3000, () => console.log('Server started listening on port 3000!'))

//routing to index & users
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))