'use strict';

//Setting up route
angular.module('workplaces').config(['$stateProvider',
	function($stateProvider) {
		// Workplaces state routing
		$stateProvider.
		state('listWorkplaces', {
			url: '/workplaces',
			templateUrl: 'modules/workplaces/views/list-workplaces.client.view.html'
		}).
		state('createWorkplace', {
			url: '/workplaces/create',
			templateUrl: 'modules/workplaces/views/create-workplace.client.view.html'
		}).
		state('viewWorkplace', {
			url: '/workplaces/:workplaceId',
			templateUrl: 'modules/workplaces/views/view-workplace.client.view.html'
		}).
		state('editWorkplace', {
			url: '/workplaces/:workplaceId/edit',
			templateUrl: 'modules/workplaces/views/edit-workplace.client.view.html'
		});
	}
]);