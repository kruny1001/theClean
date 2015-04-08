'use strict';

angular.module('the-clean').controller('TheCleanController', ['$scope','Authentication',
	function($scope, Authentication) {

        $scope.aceAction = true;
		// The clean controller logic
		// ...
        $scope.authentication = Authentication;
        //$scope.toppings = [
        //    { category: 'meat', name: 'Pepperoni' },
        //    { category: 'meat', name: 'Sausage' },
        //    { category: 'meat', name: 'Ground Beef' },
        //    { category: 'meat', name: 'Bacon' },
        //    { category: 'veg', name: 'Mushrooms' },
        //    { category: 'veg', name: 'Onion' },
        //    { category: 'veg', name: 'Green Pepper' },
        //    { category: 'veg', name: 'Green Olives' },
        //];

        $scope.tcOrder = true;
        $scope.tcStartPage = false;
        $scope.tcPrice = false;
        $scope.tcUserInfo = true;
        $scope.tcProgress = false;

        $scope.toggle = function(targetDirective) {
            return targetDirective = !targetDirective;
        }

        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.4f')(d);
                },
                transitionDuration: 500,
                xAxis: {axisLabel: 'Module(s)'},
                yAxis: {axisLabel: 'Complete(%)', axisLabelDistance: 30}
            }
        };

        $scope.data = [
            {
                key: "Cumulative Return",
                values: [
                    {"label" : "User Interface" , "value" : 22},
	                  {"label" : "Backend" , "value" : 5},
                    {"label" : "Start Page" , "value" : 5},
                    {"label" : "Icon Design" , "value" : 5},
                    {"label" : "Complete" , "value" : 100}
                ]
            }
        ]
    }
]);
