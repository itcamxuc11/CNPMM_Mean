var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');    // get body-parser
var morgan = require('morgan');         // used to see requests
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
require('./app/config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
23.
24.	// configure our app to handle CORS requests
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

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

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

var authRoutes = require('./app/routes/auth')(app, express, passport);
app.use('/auth', authRoutes);

// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.get('/profile', isLoggedIn, function (req, res) {
	res.json({ user: req.user });
});

function isLoggedIn(req, res, next) {
	// Nếu một user đã xác thực, cho đi tiếp
	if (req.isAuthenticated())
		return next();
	// Nếu chưa, đưa về trang chủ
	res.redirect('/');
}

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Dang dung Port: ' + config.port);

