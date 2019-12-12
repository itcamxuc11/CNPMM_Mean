var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');    // get body-parser
var morgan = require('morgan');         // used to see requests
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');
require('./config/passport').FbLogin(passport);
require('./config/passport').GoogleLogin(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
var corsOption = {
	origin: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
	exposedHeaders: ['x-auth-token']
  };
  app.use(cors(corsOption));

//Passport config
app.use(session({
	secret: 'ilovescodetheworld',
	cookie: { maxAge: 60000 },
	resave: true,
	saveUninitialized: true
}
)); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// log all requests to the console 
app.use(morgan('dev'));
// student can try to conntect to Mongo remotely which post in cloud
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =================
// ====================================
// API ROUTES ------------------------

var apiRoutes = require('./routes/api')(app, express);
app.use('/api', apiRoutes);

var authRoutes = require('./routes/auth')(app, express, passport);
app.use('/auth', authRoutes);

// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES


// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Dang dung Port: ' + config.port);

