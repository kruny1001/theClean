'use strict';

angular.module('the-clean').controller('HomeController', ['$scope','Authentication',
	function($scope, Authentication) {
        $scope.tcStartPage = true;
        $scope.homeContents = {
            mainTitle : "The Clean",
            subTitleText: "상세 설명 상세 설명 상세 설명 상세 설명 상세 설명"
        };
        $scope.authentication = Authentication;
        $scope.notice = "Prototype";
	}
]);
