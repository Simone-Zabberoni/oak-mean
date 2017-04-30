// CALL THE PACKAGES --------------------

var bodyParser 		= require('body-parser');
var User       		= require('../models/user');
var cookieParser 	= require('cookie-parser');

// Json WEB Tokens
var jwt        		= require('jsonwebtoken');

// Configuration file
var config     		= require('../../config');

// Particle.io API
var Particle 	 		= require('particle-api-js');


// Read super secret for creating tokens from config file
var superSecret = config.secret;

// Create particle object
var particle = new Particle();


module.exports = function(app, express) {

	// Main routing object
	var apiRouter = express.Router();

	// Route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		// Call particle.io API
		particle.login({username: req.body.username, password: req.body.password})
		.then(
			function(data){
		  	console.log('Login success! Token: ', data.body.access_token);
				// Save username into a cookie and send the result to the client application
				res.cookie('loggedUser', req.body.username)
				.json({
		      	success: true,
		      	message: 'Authentication successful.',
						token: data.body.access_token
		    	});
		},
			function(err) {
		    console.log('API call completed on promise fail: ', err);
				res.json({
	      	success: false,
	      	message: 'Authentication failed:'+err
	    	});
		  }
		);
	});

	// TODO: Particle Token list. Implement, avoid re-auth etc..
	apiRouter.post('/tokens', function(req, res) {
		particle.listAccessTokens({ username: req.body.username, password: req.body.password }).then(function(data) {
		  console.log('data on listing access tokens: ', data);
		}, function(err) {
		  console.log('error on listing access tokens: ', err);
		});
	});

	// 	MIDDLEWARE - here we check for the token for EVERY route traversal
	apiRouter.use(function(req, res, next) {
		console.log('Entering middleware...');

	  // Search the token in body, query and headers
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  if (token) {
			// if token exists, then next();
			console.log('Middleware: already authenticated');
			console.log("Reading cookie: "+ req.cookies.loggedUser );
			next(); //
	  } else {
			console.log('Middleware: not authenticated');
	    // if there is no token return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});
	  }
	});

	// Api TEST - accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	// Info for all devices at GET http://localhost:8080/api/devices
	apiRouter.route('/devices')
		.get(function(req, res) {
			// Search the token in body, query and headers
		  var token = req.body.token || req.query.token || req.headers['x-access-token'];

			// Call particle.io API
			var devicesPr = particle.listDevices({ auth: token });

			devicesPr.then(
	      function(devices){
	        console.log('Devices: ', devices);
					res.json({
		      	success: true,
		      	message: 'Device list success.',
						devices: devices.body
		    	});

	      },
	      function(err) {
	        console.log('List devices call failed: ', err);
					res.json({
		      	success: false,
		      	message: 'Device list fail: '+err
		    	});
	      }
	    );//end devicesPr
	});



	// get single device information
	apiRouter.route('/devices/:deviceId')
		.get(function(req, res) {
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			var devicesPr = particle.getDevice({ deviceId: req.params.deviceId, auth: token });

			devicesPr.then(
		  	function(device){
		    	console.log('Device attrs retrieved successfully:', device);
					res.json({
		      	success: true,
		      	message: 'Device information retrieval success.',
						device: device.body
		    	});
		  	},
			  function(err) {
			    console.log('Device information retrieval failed: ', err);
					res.json({
		      	success: false,
		      	message: 'Device information retrieval failed: '+err
		    	});
			  }
			);
	});

	// Get a device's specific variable valure
	apiRouter.route('/variable/:deviceId/:variableName')
		.get(function(req, res) {
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			particle.getVariable({ deviceId: req.params.deviceId, name: req.params.variableName, auth: token }).then(
				function(data) {
					console.log('Device variable retrieved successfully:', data);
					res.json({
		      	success: true,
		      	message: 'Device variable retrieved successfully.',
						variable: data.body
		    	});
				},
				function(err) {
					console.log('Variable information retrieval failed:', err);
					res.json({
		      	success: false,
		      	message: 'Variable information retrieval failed: '+err
		    	});
				});
	});

	// Call a device function with a specific value
	apiRouter.route('/function/:deviceId/')
		.post(function(req, res) {
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			var fnPr = particle.callFunction({ deviceId: req.params.deviceId, name: req.body.functionName, argument: req.body.functionValue, auth: token });

			fnPr.then(
			  function(data) {
			    console.log('Function called succesfully:', data);
					res.json({
						success: true,
						message: 'Function called succesfully.',
						result: data.body
					});
			  },
				function(err) {
			    console.log('Function call error:', err);
					res.json({
		      	success: false,
		      	message: 'Function call error: '+err
		    	});
			  });
	});

	// Read logged user name from cookies
	// TODO : awful, rewrite
	apiRouter.get('/me', function(req, res) {
		console.log("-----------------Inside ME api : " + req.cookies.loggedUser)
		res.send(req.cookies.loggedUser);
	});

	// Return the router object
	return apiRouter;
};
