// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express      = require('express');					// express usato per il routing lato server
var app          = express(); 									// define our app using express
var bodyParser   = require('body-parser'); 			// body-parser, lettura parametri POST
var morgan       = require('morgan'); 					// per loggare in console su node
var mongoose     = require('mongoose');					// data mondel per mongodb
var config 	     = require('./config');					// configurazione server, porte, ip, db
var path 	       = require('path');
var Particle     = require('particle-api-js');	// Interfacciamento con Particle.io
var cookieParser = require('cookie-parser');		// lettura/scrittura cookies


// APP CONFIGURATION ==================
// ====================================

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// aggiunta cookie parser, lo uso per memorizzare lo username
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

// Collegamento al db indicato in config.js
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
// innestiamo tutte le rotte definite in app/routes/api.js sull'uri /api
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// has to be registered after API ROUTES
// alla prima get / -> giriamo gli utenti al file index che poi carica angular
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// START THE SERVER
// ====================================
app.listen(config.port, config.host);
console.log('Oak Mean Manager listen on : http://' + config.host + ':' + config.port);
