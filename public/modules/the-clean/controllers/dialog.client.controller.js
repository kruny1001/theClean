'use strict';

angular.module('the-clean').controller('DialogController',DialogController);

    function DialogController($scope, $mdDialog, $http) {
        $scope.selectAddr = "";

        $scope.result = false;
        $scope.searchAddress = function(){
            var query = encodeURI($scope.keyword);
            $http.get('http://api.poesis.kr/post/search.php?v=2.5.0&q='+query)
                .success(function(data){
                    if(data.error !== "" || data.count ==0)
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
            $scope.result = true;
            $scope.basicAddr = addr;
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(addr1, addr2) {
            if(addr1 !== undefined){
                var addr = addr1 +' '+ addr2;
                $mdDialog.hide(addr);
            }
            else{
                $mdDialog.cancel();
            }
        };
    }