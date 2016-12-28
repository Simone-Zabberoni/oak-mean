var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var Particle = require('particle-api-js');
var cookieParser = require('cookie-parser');

// super secret for creating tokens
var superSecret = config.secret;

var particle = new Particle();


module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		particle.login({username: req.body.username, password: req.body.password}).then(
		//particle.login({username: config.particleUsername, password: config.particlePassword}).then(
		  function(data){
		    console.log('Login success! Token: ', data.body.access_token);

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

	// autentica e lista tokens
	apiRouter.post('/tokens', function(req, res) {

		particle.listAccessTokens({ username: req.body.username, password: req.body.password }).then(function(data) {
		  console.log('data on listing access tokens: ', data);
		}, function(err) {
		  console.log('error on listing access tokens: ', err);
		});

	});


	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Entering middleware...');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {
			console.log('Middleware: already authenticated');
			// save request ... for what ?
			//req.loggeduser = token;
			console.log("Reading cookie: "+ req.cookies.loggedUser );


			next(); //
	  } else {
			console.log('Middleware: not authenticated');
	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});
	  }
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});


	apiRouter.route('/devices')
		// get device list
		.get(function(req, res) {
			// check header or url parameters or post parameters for token
		  var token = req.body.token || req.query.token || req.headers['x-access-token'];
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




	apiRouter.route('/devices/:deviceId')
		// get single device information
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
					console.log('An error occurred while getting attrs:', err);
					res.json({
		      	success: false,
		      	message: 'An error occurred while getting attrs: '+err
		    	});
				});
	});

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
			    console.log('An error occurred:', err);
					res.json({
		      	success: false,
		      	message: 'An error occurred: '+err
		    	});
			  });
	});



	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		console.log("-----------------Inside ME api : " + req.cookies.loggedUser)
		res.send(req.cookies.loggedUser);
	});

	return apiRouter;
};
