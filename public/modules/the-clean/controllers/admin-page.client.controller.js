'use strict';

angular.module('the-clean').controller('AdminPageController', ['$scope','TheCleanCruds','$http',
	function($scope,TheCleanCruds,$http) {
		// Admin page controller logic
		// ...
        $scope.orders = TheCleanCruds.query();
        $scope.orders.$promise.then(function(result){
            $scope.numOrder = result.length;
        });

    $http.get('/usersList')
      .success(function(data){
        $scope.users = data;
        $scope.numUser = data.length;
      })
      .error(function(err){
        console.log(err);
      });


	}
]);