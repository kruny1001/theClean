'use strict';

//Setting up route
angular.module('the-clean').config(['$stateProvider','$mdIconProvider',
	function($stateProvider,$mdIconProvider) {
		// The clean state routing
		$stateProvider.
		state('tc-order', {
			url: '/tc-order',
			templateUrl: 'modules/the-clean/views/tc-order.client.view.html'
		}).
		state('the-clean', {
			url: '/the-clean',
			templateUrl: 'modules/the-clean/views/the-clean.client.view.html'
		});

		$mdIconProvider.icon('basket', 'modules/the-clean/svg/basket.svg');
		$mdIconProvider.icon('drum', 'modules/the-clean/svg/drum.svg');
	}
]);
