'use strict';

// The clean cruds controller
angular.module('the-clean-cruds').controller('TheCleanCrudsController', ['$scope', '$stateParams', '$location', 'Authentication', 'TheCleanCruds',
	function($scope, $stateParams, $location, Authentication, TheCleanCruds) {
		$scope.authentication = Authentication;


		// Create new The clean crud
		$scope.create = function() {
			// Create new The clean crud object
			var theCleanCrud = new TheCleanCruds ({
				//name: this.name,
				orderDate:this.orderDate,
				deliberyDate: this.deliberyDate,
				Address: this.address,
				numOrder: this.numOrder,
				detailInfo: this.detailInfo
			});

			// Redirect after save
			theCleanCrud.$save(function(response) {
				$location.path('the-clean-cruds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing The clean crud
		$scope.remove = function(theCleanCrud) {
			if ( theCleanCrud ) { 
				theCleanCrud.$remove();

				for (var i in $scope.theCleanCruds) {
					if ($scope.theCleanCruds [i] === theCleanCrud) {
						$scope.theCleanCruds.splice(i, 1);
					}
				}
			} else {
				$scope.theCleanCrud.$remove(function() {
					$location.path('the-clean-cruds');
				});
			}
		};

		// Update existing The clean crud
		$scope.update = function() {
			var theCleanCrud = $scope.theCleanCrud;

			theCleanCrud.$update(function() {
				$location.path('the-clean-cruds/' + theCleanCrud._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of The clean cruds
		$scope.find = function() {
			$scope.theCleanCruds = TheCleanCruds.query();
		};

		// Find existing The clean crud
		$scope.findOne = function() {
			$scope.theCleanCrud = TheCleanCruds.get({ 
				theCleanCrudId: $stateParams.theCleanCrudId
			});
		};
	}
]);
