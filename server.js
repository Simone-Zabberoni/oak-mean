// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express      = require('express');					// express for server side routing
var app          = express(); 									// define our app using express
var bodyParser   = require('body-parser');
var morgan       = require('morgan');						// console logging
var mongoose     = require('mongoose');					// mongodb data modeling
var config 	     = require('./config');					// app configuration, tcp port and ip bind
var path 	       = require('path');
var Particle     = require('particle-api-js');	// Particle.io API
var cookieParser = require('cookie-parser');		// read/write cookies


// APP CONFIGURATION ==================
// ====================================

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use cookie parser, to record session data
app.use(cookieParser());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// DB connection - still unused
// mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
// all api routes defined in app/routes/api.js are mapped to /api URI
// Example: route do_something in app/routes/api is mapped to /api/do_something
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// has to be registered after API ROUTES
// redirect the first get / to our index.html wich will load Angular
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port, config.host);
console.log('Oak Mean Manager listen on : http://' + config.host + ':' + config.port);
