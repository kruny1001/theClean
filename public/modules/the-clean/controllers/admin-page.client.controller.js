'use strict';

angular.module('the-clean').controller('AdminPageController', ['$scope','TheCleanCruds',
	function($scope,TheCleanCruds) {
		// Admin page controller logic
		// ...
        $scope.orders = TheCleanCruds.query();
        $scope.orders.$promise.then(function(result){
            $scope.numOrder = result.length;
        });
	}
]);