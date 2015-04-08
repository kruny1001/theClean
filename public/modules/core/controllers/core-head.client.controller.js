'use strict';

angular.module('core')
	.run(function ($rootScope) {

	})
	.controller('CoreHeadController',

	['$scope','$rootScope','$window','$log','$mdSidenav','$location','$state',
		'$timeout', 'Authentication',
		function($scope, $rootScope,$window,$log,$mdSidenav, $location, $state, $timeout, Authentication) {
			$scope.authentication = Authentication;
			$scope.title = "The Clean";
			$scope.subTitle = "";
			$scope.link = "";
			$scope.classroom = false;
			$scope.goTo = function(name){
				$state.go(name);
			};
			$scope.currentState = function(){};
			$scope.onchangeRoute = function(){};

			$scope.toggleLeft = function() {
				$mdSidenav('left').toggle()
					.then(function(){
						$log.debug("toggle left is done");
					});
			};
			$scope.toggleRight = function() {
				$mdSidenav('right').toggle()
					.then(function(){
						$log.debug("toggle RIGHT is done");
					});
			};
			var scrollTo = function(){
				console.log('scrollTo funciton');
			};

			$scope.change = function(){
				console.log("changed");
				if(user._id !== undefined){
					$location.path('/d2l-classes/'+user._id);
				}
			};

			$scope.loadUsers = function() {

				return $timeout(function() {
					$scope.users = D2lClassesOwnership.query();
				}, 650);
			};

			//$scope.tiles = buildGridModel({
			//	icon : "avatar:svg-",
			//	title: "Svg-",
			//	background: ""
			//});
			//function buildGridModel(tileTmpl){
			//	var it, results = [ ];
			//	for (var j=0; j<6; j++) {
			//		it = angular.extend({},tileTmpl);
			//		it.icon  = it.icon + (j+1);
			//		//it.title = it.title + (j+1);
			//		it.span  = { row : "1", col : "1" };
			//		switch(j+1) {
			//			case 1:
			//				it.ifCondition = "Authentication.user";
			//				it.id="profile";
			//				it.background = "red";
			//				it.title = "Profile";
			//				it.span.row = it.span.col = 2;
			//				break;
			//			case 2:
			//				it.ifCondition = "!Authentication.user";
			//				it.id="signIn";
			//				it.title = "Sign In";
			//				it.background = "green";
			//				it.span.row = it.span.col = 1;
			//				break;
			//			case 3:
			//				it.ifCondition = "Authentication.user";
			//				it.id="signOut";
			//				it.title = "Sign Out";
			//				it.background = "darkBlue";
			//				break;
			//			case 4:
			//				it.ifCondition = true;
			//				it.id="tutorial";
			//				it.title = "Tutorial";
			//				it.background = "blue";
			//				it.span.col = 2;
			//				break;
			//			case 5:
			//				it.ifCondition = "Authentication.user";
			//				it.id="urClass";
			//				it.background = "yellow";
			//				it.span.col = 2;
			//				it.title = "Your Classes";
			//				break;
			//			case 6:
			//				it.ifCondition = "Authentication.user";
			//				it.id="allClass";
			//				it.background = "red";
			//				it.span.col = 2;
			//				it.title = "All Classes";
			//				break;
			//		}
			//		results.push(it);
			//	}
			//	return results;
			//}

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
				console.log('closed');
				if(toState.name === "openboard"){
					$scope.title = "Getting Started";
					$scope.subTitle = "Tutorial";
				}
				else if(toState.name === "mean-home")
				{
					$scope.title = "Open Board";
					$scope.subTitle = " ";
				}
				else if(toState.name ==="d2l-home"){
					$scope.title = "Classroom";
					$scope.subTitle = " ";
				}
				else if(toState.name ==="listD2lClasses"){
					$scope.title = "Class List";
					$scope.subTitle = "Select a Class";
				}
				else if(toState.name ==='profile'){
					$scope.title = "Profile";
					$scope.subTitle = "Edit Profile";
				}

			});

			$scope.sliderNavEvent = function(name, target){
				var targetEl = $('#'+target+' figure md-grid-tile-footer h3');
				TweenLite.from(targetEl, 0.8, {scale:1.7});
				$mdSidenav('left').close()
					.then(function(){
						$log.debug("close LEFT is done");
						//console.log(target);
						//TweenMax.to($window, 1.2, {scrollTo:{y:target}, ease:Power4.easeOut});
					});
				console.log(name);
				if(name === 'Your Classes'){
					$state.go('listD2lClasses');
				}
				else if(name ==='Profile'){
					$state.go('profile');
				}
				else if(name ==='Home'){
					$state.go('the-clean');
				}
				else if(name ==='Your Order'){
					$state.go('listTheCleanCruds');
				}
				else if(name ==='Sign In'){
					console.log('sign in ');
					$location.path('/signin');
				}
				else if(name ==='Sign Out'){
					$window.location.href = 'auth/signout';
				}
			}

		}
	]);
