'use strict';

//Setting up route
angular.module('the-clean-cruds').config(['$stateProvider',
	function($stateProvider) {
		// The clean cruds state routing
		$stateProvider.
		state('listTheCleanCruds', {
			url: '/the-clean-cruds',
			templateUrl: 'modules/the-clean-cruds/views/list-the-clean-cruds.client.view.html'
		}).
		state('createTheCleanCrud', {
			url: '/the-clean-cruds/create',
			templateUrl: 'modules/the-clean-cruds/views/create-the-clean-crud.client.view.html'
		}).
		state('viewTheCleanCrud', {
			url: '/the-clean-cruds/:theCleanCrudId',
			templateUrl: 'modules/the-clean-cruds/views/view-the-clean-crud.client.view.html'
		}).
		state('editTheCleanCrud', {
			url: '/the-clean-cruds/:theCleanCrudId/edit',
			templateUrl: 'modules/the-clean-cruds/views/edit-the-clean-crud.client.view.html'
		});
	}
]);