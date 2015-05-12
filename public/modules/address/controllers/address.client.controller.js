'use strict';

angular.module('address').controller('AddressController',addressCtrl);

function addressCtrl($scope, $http) {

	$scope.selectAddr = "";
	$scope.result = true;
	$scope.searchAddress = function(){
		var query = encodeURI($scope.keyword);
		$http.get('http://api.poesis.kr/post/search.php?v=2.5.0&q='+query)
			.success(function(data){
				if(data.error !== "")
					$scope.error = data.error;
				else
					$scope.addresses = data.results;
			})
			.error(function(err){
				alert(err);
			});
	};

	$scope.updateAddress = function(selected){
		var addr = selected.address.base+ " "+ selected.address.old+" "+selected.address.new+" "+selected.address.building;
		$scope.result = false;
		$scope.basicAddr = addr;
	};
}
