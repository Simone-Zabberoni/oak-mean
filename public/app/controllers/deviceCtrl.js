angular.module('deviceCtrl', ['deviceService'])


.controller('deviceController', function(Device) {
	var vm = this;

	// wait spinning wheel
	vm.processing = true;

	// get all devices and bind the response to vm.devices
	// .all function is defined inside deviceService
	// TODO : error management
	Device.all()
		.then(function(response) {
			console.log('Inside deviceCtrl - Device.all')
			vm.processing = false;

			// bind the device info response to vm.devices
			vm.devices = response.data.devices;
			console.log(response.data.devices);
		});
})

.controller('deviceControllerSingle', function($routeParams, Device) {

	var vm = this;
	vm.processing = true;

  // Call a device funcion with aa value
	// TODO : cleanup/rewrite, it sucks
	vm.sendFunc = function(send_id, send_f_name, send_f_value) {
		vm.processing = true;
		vm.message = '';

		var send_obj = {};
		send_obj['functionName'] = send_f_name;
		send_obj['functionValue'] = send_f_value;

		Device.func(send_id, send_obj)
			.then(function(response) {
				vm.processing = false;
				vm.message = response.data.message;
				console.log(response);

				// After calling the function, get back the device info from particle
				Device.get(send_id)
					.then(function(response) {
						console.log('Inside deviceCtrl - Single Device')
						vm.processing = false;

						// bind the device info response to vm.deviceData
						vm.deviceData = response.data;

						var response_obj = {};
						vm.variables = {};

						// for each device variable
						for(var oak_var in response.data.device.variables) {

							// build a response object and bind it to vm.variables
							response_obj[oak_var] = {};
							response_obj[oak_var]["name"] = oak_var;
							response_obj[oak_var]["type"] = response.data.device.variables[oak_var];
							vm.variables = response_obj;

							// get the new value and update the binding object
							Device.variable($routeParams.device_id, oak_var)
							.then(function(response) {
								var oak_variable_name = response.data.variable.name;
								var oak_variable_value = response.data.variable.result;

								vm.variables[oak_variable_name].result = oak_variable_value;
							});
						}
						console.log(response.data);
					});
			});
	};




	// richiedo le info del device, compresi i nomi delle variabili
	Device.get($routeParams.device_id)
		.then(function(response) {
			console.log('Inside deviceCtrl - Single Device')
			vm.processing = false;
			// bind the device info response to vm.deviceData
			vm.deviceData = response.data;

			var response_obj = {};
			vm.variables = {};

			// for each device variable
			for(var oak_var in response.data.device.variables) {
				// build a response object and bind it to vm.variables
				response_obj[oak_var] = {};
				response_obj[oak_var]["name"] = oak_var;
				response_obj[oak_var]["type"] = response.data.device.variables[oak_var];
				vm.variables = response_obj;

				// get the new value and update the binding object
				Device.variable($routeParams.device_id, oak_var)
				.then(function(response) {
					var oak_variable_name = response.data.variable.name;
					var oak_variable_value = response.data.variable.result;

					// ie:	vm.variables['angle'] = 90;
					vm.variables[oak_variable_name].result = oak_variable_value;
				});
			}
			console.log(response.data);
		});


});
