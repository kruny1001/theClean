'use strict';

// Workplaces controller
angular.module('workplaces').controller('WorkplacesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workplaces',
	function($scope, $stateParams, $location, Authentication, Workplaces) {
		$scope.authentication = Authentication;

		// Create new Workplace
		$scope.create = function() {
			// Create new Workplace object
			var workplace = new Workplaces ({
				name: this.name
			});

			// Redirect after save
			workplace.$save(function(response) {
				$location.path('workplaces/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Workplace
		$scope.remove = function(workplace) {
			if ( workplace ) { 
				workplace.$remove();

				for (var i in $scope.workplaces) {
					if ($scope.workplaces [i] === workplace) {
						$scope.workplaces.splice(i, 1);
					}
				}
			} else {
				$scope.workplace.$remove(function() {
					$location.path('workplaces');
				});
			}
		};

		// Update existing Workplace
		$scope.update = function() {
			var workplace = $scope.workplace;

			workplace.$update(function() {
				$location.path('workplaces/' + workplace._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workplaces
		$scope.find = function() {
			$scope.workplaces = Workplaces.query();
		};

		// Find existing Workplace
		$scope.findOne = function() {
			$scope.workplace = Workplaces.get({ 
				workplaceId: $stateParams.workplaceId
			});
		};
	}
]);