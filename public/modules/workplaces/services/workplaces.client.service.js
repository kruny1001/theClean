'use strict';

//Workplaces service used to communicate Workplaces REST endpoints
angular.module('workplaces').factory('Workplaces', ['$resource',
	function($resource) {
		return $resource('workplaces/:workplaceId', { workplaceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);