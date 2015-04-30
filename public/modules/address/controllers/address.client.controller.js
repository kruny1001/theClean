'use strict';

angular.module('address').controller('AddressController',addressCtrl);



function addressCtrl($scope, $http) {
	$scope.result=[];
	$http.get('http://api.poesis.kr/post/search.php', {v:"2.5.0", q:"%EC%8B%A0%EC%A0%95%EB%8F%99"})
		.success(function(data){
			console.log(data);
		});

	console.log(encodeURI("신정동"));

	$scope.searchAddress = function(){
		var query = encodeURI("신정동");
		$http.get('http://api.poesis.kr/post/search.php?v=2.5.0&q='+query)
			.success(function(data){
				$scope.addresses = data.results;
			})
	}
}
