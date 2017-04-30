// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
// express for server side routing
var express      = require('express');

// Define our app using express
var app          = express();

// Use body parser for token extraction
var bodyParser   = require('body-parser');

// Console logging
var morgan       = require('morgan');

// Mongodb data modeling
var mongoose     = require('mongoose');

// App configuration, tcp port and ip bind
var config 	     = require('./config');

// Utilities for local dir & files
var path 	       = require('path');

// Particle.io API
var Particle     = require('particle-api-js');

// Read/write cookies
var cookieParser = require('cookie-parser');


// APP CONFIGURATION ==================
// ====================================

// Use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use cookie parser, to record session data
app.use(cookieParser());

// Configure our app to handle CORS requests
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

// Set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));



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
