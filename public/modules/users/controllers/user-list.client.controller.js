'use strict';

angular.module('users').controller('UserListController', UserListController);
	function UserListController($scope, $http) {
		// User list controller logic
		// ...
        $http.get('/usersList')
            .success(function(data){
                $scope.users = data;
                $scope.numUser = data.length;
            })
            .error(function(err){
                console.log(err);
            });
	}
