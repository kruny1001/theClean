'use strict';

//Setting up route
angular.module('address').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('address', {
			url: '/address',
			templateUrl: 'modules/address/views/address.client.view.html'
		});
	}
]);