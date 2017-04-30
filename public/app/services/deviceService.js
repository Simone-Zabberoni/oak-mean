angular.module('deviceService', [])

// ===================================================
// device factory to login and get information
// inject $http for communicating with the API
// ===================================================

.factory('Device', function($http) {
	// create auth factory object
	var deviceFactory = {};


	// get a single device
	deviceFactory.get = function(id) {
		return $http.get('/api/devices/' + id);
	};

	// get all devices
	deviceFactory.all = function() {
		return $http.get('/api/devices/');
	};

  // get variable value
	deviceFactory.variable = function(id, variableName) {
		return $http.get('/api/variable/' + id + '/' + variableName);
	};

  // call a device func
	deviceFactory.func = function(id, funcData) {
		return $http.post('/api/function/' + id, funcData);
	};

	// return device  factory object
	return deviceFactory;

});
