'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
		$scope.signup = function() {
            if($scope.pwConfirm == $scope.credentials.password)
            {
                $http.post('/auth/signup', $scope.credentials).success(function (response) {
                    // If successful we assign the response to the global user model
                    $scope.authentication.user = response;
                    // And redirect to the index page
                    $location.path('/');
                }).error(function (response) {
                    $scope.error = response.message;
                });
            }
            else{
                console.log('Not Matched');
                $scope.error = "비밀번호가 일치하지 않습니다.";
            }
        };

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);