angular.module('deviceCtrl', ['deviceService'])


.controller('deviceController', function(Device) {

	var vm = this;
	vm.processing = true;		// spinning wheel di wait

	// otteniamo tutti i device e mappiamo l'oggetto su su vm.devices
	Device.all()
		.then(function(response) {
			console.log('Inside deviceCtrl - Device.all')
			vm.processing = false;	// spinning wheel di wait

			// TODO : gestione degli errori!!

			// bind the device info that come back to vm.devices
			vm.devices = response.data.devices;
			console.log(response.data.devices);
		});
})

.controller('deviceControllerSingle', function($routeParams, Device) {

	var vm = this;
	vm.processing = true;		// spinning wheel di wait

	// TODO : ristrutturare, fa schifo
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




	// richiedo le info del device, compresi i nomi delle variabili
	Device.get($routeParams.device_id)
		.then(function(response) {

			console.log('Inside deviceCtrl - Single Device')

			vm.processing = false;

			// bind del risultato su vm.deviceData
			vm.deviceData = response.data;


			var response_obj = {};
			vm.variables = {};

			// per ogni variabile costruisco un oggetto che comprenda nome, type e valore
			// quest'oggetto verrà quindi bindato a vm.variables
			for(var oak_var in response.data.device.variables) {
				response_obj[oak_var] = {};
				response_obj[oak_var]["name"] = oak_var;
				response_obj[oak_var]["type"] = response.data.device.variables[oak_var];
				vm.variables = response_obj;

				// richiedo al particle il varlore della variabile legata al device id
				Device.variable($routeParams.device_id, oak_var)
				.then(function(response) {
					// bind dei risultati a vm.variables
					var oak_variable_name = response.data.variable.name;
					var oak_variable_value = response.data.variable.result;

					// esempio finale:	vm.variables['angle'] = 90;
					vm.variables[oak_variable_name].result = oak_variable_value;
				});
			}
			console.log(response.data);
		});


});
