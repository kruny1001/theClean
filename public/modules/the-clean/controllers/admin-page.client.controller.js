'use strict';

angular.module('the-clean').controller('AdminPageController', ['$scope','TheCleanCruds','$http','$state','Workplaces',
	function($scope, TheCleanCruds, $http, $state, Workplaces) {

        $scope.workplaces = Workplaces.query();
        $scope.workplaces.$promise.then(function(result){
            $scope.numPlaces = result.length;
        });
        $scope.mainContents=[
            {title:'간편한 결제 시스템', body:''},
            {title:'실시간 업데이트', body:''},
            {title:'합리적 가격', body:''},
            {title:'고객 만족 서비스', body:''},

        ];
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

    $scope.goTo = function(name){
        $state.go(name);
    }
}
]);