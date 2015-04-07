'use strict';

//The clean cruds service used to communicate The clean cruds REST endpoints
angular.module('the-clean-cruds').factory('TheCleanCruds', ['$resource',
	function($resource) {
		return $resource('the-clean-cruds/:theCleanCrudId', { theCleanCrudId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);