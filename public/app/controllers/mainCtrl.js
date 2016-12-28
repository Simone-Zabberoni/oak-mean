angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

		// get user information on page load
		Auth.getUser()
			.then(function(response) {
				vm.user = response.data;
			});
	});

	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.then(function(response) {
				vm.processing = false;

				// if a user successfully logs in, redirect to users page
				if (response.data.success) {
					console.log('mainCtrl login OK: ' + response.data.token);
					$location.path('/devices');
				}
				else {
					console.log('mainCtrl login NON OK: ' + response.data.token);
					vm.error = response.data.message;
				}
			});
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';

		$location.path('/login');
	};

	vm.createSample = function() {
		Auth.createSampleUser();
	};

});
