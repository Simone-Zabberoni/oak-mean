angular.module('deviceCtrl', ['deviceService'])

.controller('deviceController', function(Device) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	Device.all()
		.then(function(response) {
			console.log('Inside deviceCtrl - Device.all')
			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.devices = response.data.devices;

			console.log(response.data.devices);

		});
})

.controller('deviceControllerSingle', function($routeParams, Device) {

	var vm = this;
	vm.processing = true;


	vm.sendFunc = function(send_id, send_f_name, send_f_value) {
		vm.processing = true;
		vm.message = '';

		var send_obj = {};
		send_obj['functionName'] = send_f_name;
		send_obj['functionValue'] = send_f_value;

		// use the create function in the userService
		//User.create(vm.userData)
		Device.func(send_id, send_obj)
			.then(function(response) {
				vm.processing = false;
				vm.message = response.data.message;
				console.log(response);

				Device.get(send_id)
					.then(function(response) {

						console.log('Inside deviceCtrl - Single Device')

						// when all the users come back, remove the processing variable
						vm.processing = false;

						// bind the users that come back to vm.users
						vm.deviceData = response.data;

						var response_obj = {};
						vm.variables = {};
						//console.log(response.data);

						for(var oak_var in response.data.device.variables) {
							response_obj[oak_var] = {};
							response_obj[oak_var]["name"] = oak_var;
							response_obj[oak_var]["type"] = response.data.device.variables[oak_var];
							vm.variables = response_obj;

							Device.variable($routeParams.device_id, oak_var)
							.then(function(response) {
								//console.log(response);
								var oak_variable_name = response.data.variable.name;
								var oak_variable_value = response.data.variable.result;
								//console.log(oak_variable_name + ' : ' + oak_variable_value);

								vm.variables[oak_variable_name].result = oak_variable_value;
								//console.log('---------------');
								//console.log(vm);
								//vm.variables.[oak_variable_name] = response.data.variable.result;
								//console.log(vm.variables.oak_variable_name);

							});
						}
						console.log(response.data);
					});


			});

	};


	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	//vm.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	Device.get($routeParams.device_id)
		.then(function(response) {

			console.log('Inside deviceCtrl - Single Device')

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.deviceData = response.data;

			var response_obj = {};
			vm.variables = {};
			//console.log(response.data);

			for(var oak_var in response.data.device.variables) {
				response_obj[oak_var] = {};
				response_obj[oak_var]["name"] = oak_var;
				response_obj[oak_var]["type"] = response.data.device.variables[oak_var];
				vm.variables = response_obj;

				Device.variable($routeParams.device_id, oak_var)
				.then(function(response) {
					//console.log(response);
					var oak_variable_name = response.data.variable.name;
					var oak_variable_value = response.data.variable.result;
					//console.log(oak_variable_name + ' : ' + oak_variable_value);

					vm.variables[oak_variable_name].result = oak_variable_value;
					//console.log('---------------');
					//console.log(vm);
					//vm.variables.[oak_variable_name] = response.data.variable.result;
					//console.log(vm.variables.oak_variable_name);

				});
			}
			console.log(response.data);
		});


});
