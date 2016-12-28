var bodyParser 		= require('body-parser'); 	// get body-parser
var User       		= require('../models/user');
var jwt        		= require('jsonwebtoken');
var config     		= require('../../config');
var Particle 	 		= require('particle-api-js');
var cookieParser 	= require('cookie-parser');

// super secret for creating tokens
var superSecret = config.secret;

// particle object
var particle = new Particle();


module.exports = function(app, express) {

	// oggetto principale per il routing
	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		particle.login({username: req.body.username, password: req.body.password})
		.then(
			function(data){
		  	console.log('Login success! Token: ', data.body.access_token);

				// da qui in poi si lavora via tokens, salvo lo username nei cookies
				res.cookie('loggedUser', req.body.username)

				// e invio il json risultante
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
	// TODO: completare usare per evitare la ri-autentica
	apiRouter.post('/tokens', function(req, res) {
		particle.listAccessTokens({ username: req.body.username, password: req.body.password }).then(function(data) {
		  console.log('data on listing access tokens: ', data);
		}, function(err) {
		  console.log('error on listing access tokens: ', err);
		});
	});


	// 	MIDDLEWARE - qui verifichiamo il token, ovvero se ci siamo già autenticati  o meno
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Entering middleware...');

	  // cerchiamo il token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {
			// se il token esiste next();
			console.log('Middleware: already authenticated');
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

	// Api TEST
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	// info su tutti i devices
	apiRouter.route('/devices')
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

	// valore di una variabile
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

	// lettura cookies
	// TODO : orrendo, di fatto legge dal browser e ritorna al browser. Gestire lato angular
	apiRouter.get('/me', function(req, res) {
		console.log("-----------------Inside ME api : " + req.cookies.loggedUser)
		res.send(req.cookies.loggedUser);
	});


	return apiRouter;
};
