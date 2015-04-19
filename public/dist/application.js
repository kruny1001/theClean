'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies =
		['ngResource', 'ngAnimate', 'ui.router',
			,'ngMaterial'
		];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('cl');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('the-clean-cruds');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('the-clean');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		// Create new Article
		$scope.create = function() {
			// Create new Article object
			var article = new Articles({
				title: this.title,
				content: this.content
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		// Find existing Article
		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('mean-home', {
			url: '/mean',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core')
	.run(["$rootScope", function ($rootScope) {

	}])
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
                else if(name ==='Make Order'){
                    $state.go('createTheCleanCrud');
                }
			}

		}
	]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('the-clean-cruds').config(['$stateProvider',
	function($stateProvider) {
		// The clean cruds state routing
		$stateProvider.
		state('listTheCleanCruds', {
			url: '/the-clean-cruds',
			templateUrl: 'modules/the-clean-cruds/views/list-the-clean-cruds.client.view.html'
		}).
		state('createTheCleanCrud', {
			url: '/the-clean-cruds/create',
			templateUrl: 'modules/the-clean-cruds/views/create-the-clean-crud.client.view.html'
		}).
		state('viewTheCleanCrud', {
			url: '/the-clean-cruds/:theCleanCrudId',
			templateUrl: 'modules/the-clean-cruds/views/view-the-clean-crud.client.view.html'
		}).
		state('editTheCleanCrud', {
			url: '/the-clean-cruds/:theCleanCrudId/edit',
			templateUrl: 'modules/the-clean-cruds/views/edit-the-clean-crud.client.view.html'
		});
	}
]);
'use strict';

// The clean cruds controller
angular.module('the-clean-cruds').controller('TheCleanCrudsController', ['$scope', '$stateParams', '$location', 'Authentication', 'TheCleanCruds',
	function($scope, $stateParams, $location, Authentication, TheCleanCruds) {
		$scope.authentication = Authentication;


		// Create new The clean crud
		$scope.create = function() {
			// Create new The clean crud object
			var theCleanCrud = new TheCleanCruds ({
				//name: this.name,
				orderDate:this.orderDate,
				deliberyDate: this.deliberyDate,
				Address: this.address,
				numOrder: this.numOrder,
				detailInfo: this.detailInfo
			});

			// Redirect after save
			theCleanCrud.$save(function(response) {
				$location.path('the-clean-cruds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing The clean crud
		$scope.remove = function(theCleanCrud) {
			if ( theCleanCrud ) { 
				theCleanCrud.$remove();

				for (var i in $scope.theCleanCruds) {
					if ($scope.theCleanCruds [i] === theCleanCrud) {
						$scope.theCleanCruds.splice(i, 1);
					}
				}
			} else {
				$scope.theCleanCrud.$remove(function() {
					$location.path('the-clean-cruds');
				});
			}
		};

		// Update existing The clean crud
		$scope.update = function() {
			var theCleanCrud = $scope.theCleanCrud;

			theCleanCrud.$update(function() {
				$location.path('the-clean-cruds/' + theCleanCrud._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of The clean cruds
		$scope.find = function() {
			$scope.theCleanCruds = TheCleanCruds.query();
		};

		// Find existing The clean crud
		$scope.findOne = function() {
			$scope.theCleanCrud = TheCleanCruds.get({ 
				theCleanCrudId: $stateParams.theCleanCrudId
			});
		};
	}
]);

'use strict';

//The clean cruds service used to communicate The clean cruds REST endpoints
angular.module('the-clean-cruds').factory('TheCleanCruds', ['$resource',
	function($resource) {
		return $resource('the-clean-cruds/:theCleanCrudId', { theCleanCrudId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('the-clean').config(['$stateProvider','$mdIconProvider',
	function($stateProvider,$mdIconProvider) {
		// The clean state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/the-clean/views/home.client.view.html'
		}).
		state('tc-order', {
			url: '/tc-order',
			templateUrl: 'modules/the-clean/views/tc-order.client.view.html'
		}).
		state('the-clean', {
			url: '/the-clean',
			templateUrl: 'modules/the-clean/views/the-clean.client.view.html'
		});

		$mdIconProvider.icon('basket', 'modules/the-clean/svg/basket.svg');
		$mdIconProvider.icon('drum', 'modules/the-clean/svg/drum.svg');
	}
]);

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

'use strict';

angular.module('the-clean').controller('TcOrderController', ['$scope',
	function($scope) {
		// Tc order controller logic
		// ...
	}
]);
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


Object.defineProperty(PIXI.DisplayObject.prototype, 'scaleX', {
	get: function() {
		return  this.scale.x;
	},
	set: function(value) {
		this.scale.x = value;
	}
});

Object.defineProperty(PIXI.DisplayObject.prototype, 'scaleY', {
	get: function() {
		return  this.scale.y;
	},
	set: function(value) {
		this.scale.y = value;
	}
});


angular.module('the-clean').directive('aniAce',
	function() {
		aniAceCtrl.$inject = ["$scope"];
		return {
			templateUrl: 'modules/the-clean/directives/template/ani-ace.html',
			restrict: 'E',
			controller: aniAceCtrl,

			link: function postLink(scope, element, attrs) {
			} // End link
		};

		function aniAceCtrl($scope){


			var COLORS = [ '0x694D8B', '0xd83784', '0xd62b2e', '0xe5de3a', '0x74b74a', '0x15a1c5' ];

			var renderer;
			var stage;
			var vizGroup;
			var momentGroup;
			var momentAce;
			//var momentAdvantage;
			//var momentDoubleFault;
			//var momentDeuce;
			var animationTimer;
			var toRAD = Math.PI/180;
			var matchVizViewConfig = {
				isWebGL: true
			};

			var aceBallTrailer;
			var aceBall;
			var aceCircle1;
			var aceCircle2;
			var aceCircleOutline1;
			var aceCircleOutline2;
			var aceRectangle;
			var aceCircle3;
			var aceCircle4;
			var aceCircle5;
			var aceCircle6;
			var aceCircle7;
			var aceCircle8;
			var aceCircle9;
			var aceLightning1,
				aceLightning2,
				aceLightning3,
				aceLightning4,
				aceLightning5,
				aceLightning6,
				aceLightning7,
				aceLightning8,
				aceLightning9,
				aceTitle;

			var aceAnimationOut;

			var aceAnimationIn;



			function initBeast(){
				momentGroup = new PIXI.DisplayObjectContainer();
				stage.addChild(momentGroup);
				drawBeast();
				createAce();
			}

			function hideMoments() {
				clearTimeout(animationTimer);
				momentAce.visible = false;
				if (__PE)
					__PE.reset();
			}

			function generateRandomNumber(min, max) {
				var random = Math.floor(Math.random() * (max - min + 1)) + min;
				return random;
			}

			var __PE; // reference to active particle engine;

			function drawBeast(){
				if (__PE)
					__PE.step();
			}

			function resizeBeast(){
				if (momentGroup){
					momentGroup.x = renderer.width/2;
					momentGroup.y = renderer.height/2;
				}
			}

			function passParticlesToRAF(PE) {
				__PE = PE;
			}


			/////////////////////////

			var aceRectArray = [];
			var aceExplosionArray1 = [];
			var aceExplosionArray2 = [];
			var aceColors = ["0x8cc63f", "0x00b2ef"];

//////////////// PARTICLE STUFF /////////////////
			var aceParticles 	= new ParticleEngine(window.innerWidth, 500);
			var aceEmitters 	= [];
			var aceParticleContainer;
			var aceEm_TennisBalls,
				aceEm_LightningBolts,
				aceEm_ThinShards,
				aceEm_Circles;
/////////////////////////////////////////////////

			function createAce() {
				momentAce = new PIXI.DisplayObjectContainer();
				momentGroup.addChild(momentAce);
				var imagePath = "modules/the-clean/directives/template/img/";
				var assetsToLoader = [
					imagePath+"lightning1.png",
					imagePath+"lightning2.png",
					imagePath+"lightning3.png",
					imagePath+"lightning4.png",
					imagePath+"lightning5.png",
					imagePath+"lightning6.png",
					imagePath+"lightning7.png",
					imagePath+"lightning8.png",
					imagePath+"lightning9.png"
				];
				var loader = new PIXI.AssetLoader(assetsToLoader);
				loader.onComplete = onAssetsLoaded;
				loader.load();

				function onAssetsLoaded() {

					//////////////// PARTICLE STUFF /////////////////
					aceParticleContainer = new PIXI.DisplayObjectContainer();
					momentAce.addChild(aceParticleContainer);

					aceEm_TennisBalls = new Emitter({
							type		:	"chaos",
							count		:	50
						},
						{ 	type 		:	SimpleParticle,
							image		:	imagePath+"ball-white.png",
							life		: 	800.0,
							spin		: 	[-0.03, 0.03],
							speed		: 	[1, 3],
							scale		: 	[0.01,0.02],
							colors		: 	[aceColors[0], aceColors[1], 0xffffff],
							fade		: 	0.2,
							blendMode 	:	PIXI.blendModes.NORMAL
						}
					);

					aceEm_LightningBolts = new Emitter({
							type		:	"linear",
							count		:	35,
							angle		:	135
						},
						{ 	type 		:	SimpleParticle,
							image		:	imagePath+"lightning-white.png",
							life		: 	1000.0,
							spin		: 	[0,0],
							speed		: 	[0.05, 1],
							scale		: 	[0.05,0.5],
							colors		: 	[aceColors[0], aceColors[1]],
							fade		: 	0.2,
							blendMode 	:	PIXI.blendModes.NORMAL
						}
					);

					aceEm_ThinShards = new Emitter({
							type		:	"linear",
							count		:	50,
							angle		:	-45
						},
						{ 	type 		:	SimpleParticle,
							image		:	imagePath+"shard2-white.png",
							life		: 	1000.0,
							spin		: 	[0,0],
							speed		: 	[0.05, 1],
							scale		: 	[0.05, 1],
							colors		: 	[aceColors[0], aceColors[1]],
							fade		: 	0.2,
							blendMode 	:	PIXI.blendModes.NORMAL
						}
					);

					aceEm_Circles = new Emitter({
							type		:	"point",
							count		:	50
						},
						{ 	type 		:	CircleParticle,
							size 		: 	15,
							life		: 	800.0,
							spin		: 	[-0.00, 0.00],
							speed		: 	[1, 3],
							scale		: 	[.25,1],
							colors		: 	[aceColors[0], aceColors[1]],
							fade		: 	0.4,
							blendMode 	:	PIXI.blendModes.NORMAL
						}
					);

					aceEmitters.push(aceEm_TennisBalls);
					aceEmitters.push(aceEm_LightningBolts);
					aceEmitters.push(aceEm_ThinShards);
					aceEmitters.push(aceEm_Circles);

					aceParticles.addEmitters(aceEmitters);

					aceParticleContainer.addChild(aceEm_TennisBalls.doc);
					aceParticleContainer.addChild(aceEm_LightningBolts.doc);
					aceParticleContainer.addChild(aceEm_ThinShards.doc);
					aceParticleContainer.addChild(aceEm_Circles.doc);
					/////////////////////////////////////////////////

					aceCircleOutline1 = new PIXI.Graphics();
					aceCircleOutline1.lineStyle(3, aceColors[0], 1);
					aceCircleOutline1.drawCircle(0, 0, 75);
					aceCircleOutline1.endFill();
					if (matchVizViewConfig.isWebGL) aceCircleOutline1.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceCircleOutline1);

					aceCircleOutline2 = new PIXI.Graphics();
					aceCircleOutline2.lineStyle(5, aceColors[1], 1);
					aceCircleOutline2.drawCircle(0, 0, 25);
					aceCircleOutline2.endFill();
					if (matchVizViewConfig.isWebGL) aceCircleOutline2.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceCircleOutline2);

					// CREATE SOME RECTANGLES
					for (var i = 0; i < 3; i++) {
						aceRectangle = new PIXI.Graphics();
						if (matchVizViewConfig.isWebGL) aceRectangle.blendMode = PIXI.blendModes.MULTIPLY;
						aceRectangle.pivot.x = 2000;
						aceRectangle.pivot.y = 50;
						aceRectangle.rotation = (15 * toRAD);
						momentAce.addChild(aceRectangle);
						aceRectArray.push(aceRectangle);
					}

					// CREATE SOME EXPLOSION PIECES
					for (var i = 0; i < 6; i++) {
						var aceParticle = new PIXI.Graphics();
						var randomParticleType = generateRandomNumber(0,5);

						switch (randomParticleType) {
							case 0:
								aceParticle.lineStyle(2, aceColors[0], 1);
								aceParticle.drawCircle(0, 0, generateRandomNumber(5, 15));
								break;
							default:
								aceParticle.beginFill(aceColors[1], .5);
								aceParticle.drawCircle(0, 0, generateRandomNumber(2, 10));
						}
						aceParticle.endFill();
						if (matchVizViewConfig.isWebGL) aceParticle.blendMode = PIXI.blendModes.MULTIPLY;
						momentAce.addChild(aceParticle);
						aceExplosionArray2.push(aceParticle);
					}

					aceBallTrailer = new PIXI.Graphics();
					aceBallTrailer.pivot.x = 5;
					aceBallTrailer.pivot.y = 0;
					if (matchVizViewConfig.isWebGL) aceBallTrailer.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceBallTrailer);

					aceBall = new PIXI.Graphics();
					if (matchVizViewConfig.isWebGL) aceBall.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceBall);

					aceCircle1 = new PIXI.Graphics();
					if (matchVizViewConfig.isWebGL) aceCircle1.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceCircle1);

					aceCircle2 = new PIXI.Graphics();
					if (matchVizViewConfig.isWebGL) aceCircle2.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceCircle2);

					aceCircle3 = new PIXI.Graphics();
					if (matchVizViewConfig.isWebGL) aceCircle3.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceCircle3);

					aceCircle4 = new PIXI.Graphics();
					if (matchVizViewConfig.isWebGL) aceCircle4.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceCircle4);

					aceCircle5 = new PIXI.Graphics();
					if (matchVizViewConfig.isWebGL) aceCircle5.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceCircle5);

					aceLightning1 = PIXI.Texture.fromImage(imagePath+"lightning1.png");
					aceLightning1 = new PIXI.Sprite(aceLightning1);
					aceLightning1.anchor.x = 0.5;
					aceLightning1.anchor.y = 0.5;
					aceLightning1.tint = aceColors[0];
					if (matchVizViewConfig.isWebGL) aceLightning1.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning1);

					aceLightning2 = PIXI.Texture.fromImage(imagePath+"lightning2.png");
					aceLightning2 = new PIXI.Sprite(aceLightning2);
					aceLightning2.anchor.x = 0.5;
					aceLightning2.anchor.y = 0.5;
					aceLightning2.tint = aceColors[1];
					if (matchVizViewConfig.isWebGL) aceLightning2.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning2);

					aceLightning3 = PIXI.Texture.fromImage(imagePath+"lightning3.png");
					aceLightning3 = new PIXI.Sprite(aceLightning3);
					aceLightning3.anchor.x = 0.5;
					aceLightning3.anchor.y = 0.5;
					aceLightning3.tint = aceColors[0];
					if (matchVizViewConfig.isWebGL) aceLightning3.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning3);

					aceLightning4 = PIXI.Texture.fromImage(imagePath+"lightning4.png");
					aceLightning4 = new PIXI.Sprite(aceLightning4);
					aceLightning4.anchor.x = 0.5;
					aceLightning4.anchor.y = 0.5;
					aceLightning4.tint = aceColors[1];
					if (matchVizViewConfig.isWebGL) aceLightning4.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning4);

					aceLightning5 = PIXI.Texture.fromImage(imagePath+"lightning5.png");
					aceLightning5 = new PIXI.Sprite(aceLightning5);
					aceLightning5.anchor.x = 0.5;
					aceLightning5.anchor.y = 0.5;
					aceLightning5.tint = aceColors[1];
					if (matchVizViewConfig.isWebGL) aceLightning5.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning5);

					aceLightning6 = PIXI.Texture.fromImage(imagePath+"lightning6.png");
					aceLightning6 = new PIXI.Sprite(aceLightning6);
					aceLightning6.anchor.x = 0.5;
					aceLightning6.anchor.y = 0.5;
					aceLightning6.tint = aceColors[0];
					if (matchVizViewConfig.isWebGL) aceLightning6.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning6);

					aceLightning7 = PIXI.Texture.fromImage(imagePath+"lightning7.png");
					aceLightning7 = new PIXI.Sprite(aceLightning7);
					aceLightning7.anchor.x = 0.5;
					aceLightning7.anchor.y = 0.5;
					aceLightning7.tint = aceColors[1];
					if (matchVizViewConfig.isWebGL) aceLightning7.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning7);

					aceLightning8 = PIXI.Texture.fromImage(imagePath+"lightning8.png");
					aceLightning8 = new PIXI.Sprite(aceLightning8);
					aceLightning8.anchor.x = 0.5;
					aceLightning8.anchor.y = 0.5;
					aceLightning8.tint = aceColors[0];
					if (matchVizViewConfig.isWebGL) aceLightning8.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning8);

					aceLightning9 = PIXI.Texture.fromImage(imagePath+"lightning9.png");
					aceLightning9 = new PIXI.Sprite(aceLightning9);
					aceLightning9.anchor.x = 0.5;
					aceLightning9.anchor.y = 0.5;
					aceLightning9.tint = aceColors[0];
					if (matchVizViewConfig.isWebGL) aceLightning9.blendMode = PIXI.blendModes.MULTIPLY;
					momentAce.addChild(aceLightning9);

					aceTitle = new PIXI.Text("GREAT", { font: "80px Droid Sans", fill: "#ffffff" });
					aceTitle.anchor.x = 0.5;
					aceTitle.anchor.y = 0.5;
					momentAce.addChild(aceTitle);

					TweenMax.to($('#icon_ace'), 1, {css:{ display: 'inline-block', autoAlpha: 1}, delay: 0});
				}
				momentAce.visible = false;
			}


			function redrawAce() {
				var tempColorOrder = 1 + Math.floor(Math.random()*2);
				if (tempColorOrder === 1) {
					aceColors = ["0x8cc63f", "0x00b2ef"];
				} else {
					aceColors = ["0x00b2ef", "0x8cc63f"];
				}

				aceBallTrailer.clear();
				aceBallTrailer.beginFill(aceColors[0], .25);
				aceBallTrailer.drawRect(0, 0, 10, 400);
				aceBallTrailer.endFill();

				aceBall.clear();
				aceBall.beginFill(aceColors[0], 1);
				aceBall.drawCircle(0, 0, 100);
				aceBall.endFill();
				aceBall.beginFill(aceColors[0], .5);
				aceBall.drawCircle(-7, -7, 90);
				aceBall.endFill();

				aceCircle1.clear();
				aceCircle1.beginFill(aceColors[0], .20);
				aceCircle1.drawCircle(0, 0, 115);
				aceCircle1.endFill();

				aceCircle2.clear();
				aceCircle2.beginFill(aceColors[0], .5);
				aceCircle2.drawCircle(0, 0, 115);
				aceCircle2.endFill();

				aceCircle3.clear();
				aceCircle3.beginFill(aceColors[0], .4);
				aceCircle3.drawCircle(0, 0, 115);
				aceCircle3.endFill();

				aceCircle4.clear();
				aceCircle4.beginFill(aceColors[0], .40);
				aceCircle4.drawCircle(0, 0, 85);
				aceCircle4.endFill();

				aceCircle5.clear();
				aceCircle5.beginFill(aceColors[1], 1);
				aceCircle5.drawCircle(0, 0, 45);
				aceCircle5.endFill();

				aceLightning1.tint = aceColors[0];
				aceLightning2.tint = aceColors[1];
				aceLightning3.tint = aceColors[0];
				aceLightning4.tint = aceColors[1];
				aceLightning5.tint = aceColors[1];
				aceLightning6.tint = aceColors[0];
				aceLightning7.tint = aceColors[1];
				aceLightning8.tint = aceColors[0];
				aceLightning9.tint = aceColors[0];

				for (var i = 0; i < 3; i++) {
					aceRectArray[i].clear();
					aceRectArray[i].beginFill(aceColors[1], 1);
					aceRectArray[i].drawRect(0, 0, 4000, 100);
					aceRectArray[i].endFill();
				}

			}

			function explodeAce() {
				hideMoments();
				redrawAce();

				//////////////// PARTICLE STUFF /////////////////
				var w = window.innerWidth;
				var h = 500; //window.innerHeight;

				var i = 0;
				var em;
				while ( i < aceEmitters.length ) {
					em = aceEmitters[i++];
					em.w = w;
					em.h = h;
					em.reset();
				}

				// hAX
				passParticlesToRAF(aceParticles);

				/////////////////////////////////////////////////

				aceAnimationIn =  new TimelineMax({ paused: true});

				aceAnimationIn.fromTo( aceBall, .75,{ x: 0, y: 250, scaleX: 0.05, scaleY: 0.05, alpha: 0},{ x: 0, y: -200, scaleX: 0.05, scaleY: 0.05, alpha: 1, ease: Expo.easeOut });
				aceAnimationIn.to( aceBall, .75, { x: 0, y: -100, ease: Expo.easeIn });
				aceAnimationIn.to( aceBall, .5, { bezier: {values:[{ x: 200, y: 0 }, { x: 300, y: 200 }] }, scaleX: 0.25, scaleY: 0.25, alpha: 1, ease: Quad.easeOut });
				aceAnimationIn.to( aceBall, .5, { bezier: {values:[{ x: 50, y: 0 }, {x: 0, y: 0 }]}, alpha: 0, scaleX: 10, scaleY: 10, ease: Quad.easeOut }, "-=.25");

				// TRAILER
				aceAnimationIn.add(TweenMax.fromTo( aceBallTrailer, 1,{ x: 0, y: 250, scaleY: 5, alpha: 1 },{ x: 0, y: -200, scaleY: 0.75, alpha: 0, ease: Expo.easeOut }), 0);

				// BALL EXPLOSION
				aceAnimationIn.add(TweenMax.fromTo( aceCircleOutline1, 1,{ x: 0, y: -100, scaleX: 0.1, scaleY: 0, alpha: 1 },{ x: 0, y: -100, scaleX: 1, scaleY: 1, alpha: 0, ease: Expo.easeOut }), 1.5);
				aceAnimationIn.add(TweenMax.fromTo( aceCircleOutline2, 1,{ x: 0, y: -100, scaleX: 0.1, scaleY: 0, alpha: 1 },{ x: 0, y: -100, scaleX: 1, scaleY: 1, alpha: 0, ease: Expo.easeOut }), 1.5);

				//////////////// PARTICLE STUFF /////////////////
				aceAnimationIn.add(TweenMax.fromTo( aceParticleContainer, 1, { alpha: 0}, { alpha: 1 }), 0);
				aceAnimationIn.add(TweenMax.fromTo( aceEm_TennisBalls.doc, 1, { scaleX: 0.0, scaleY: 0.0}, {  scaleX: 1.0, scaleY: 1.0, ease: Quart.easeInOut }), 1.5);
				aceAnimationIn.add(TweenMax.fromTo( aceEm_LightningBolts.doc, 0.75,{ scaleX: 0.0, scaleY: 0.0, x: 600 , y: -600, alpha: 0}, { scaleX: 1.0, scaleY: 1.0, x: 0, y: 0, alpha: 1, ease: Quart.easeInOut }), 1.5);
				aceAnimationIn.add(TweenMax.fromTo( aceEm_ThinShards.doc, 0.75,{ scaleX: 0.0, scaleY: 0.0, x: -600,  y: 600, alpha: 0}, { scaleX: 1.0, scaleY: 1.0, x: 0, y: 0, alpha: 1, ease: Quart.easeInOut }), 1.5);
				aceAnimationIn.add(TweenMax.fromTo( aceEm_Circles.doc, 0.75,{ scaleX: 0.0, scaleY: 0.0, x: -600,  y: 600, alpha: 0}, { scaleX: 1.0, scaleY: 1.0, x: 0, y: 0, alpha: 1, ease: Quart.easeInOut }), 1.5);
				/////////////////////////////////////////////////

				// PARTICLE EXPLOSIONS 1
				for (var i = 0; i < aceExplosionArray2.length; i++) {
					var circle = aceExplosionArray2[i];
					var destinationX = generateRandomNumber(-100, 100);
					var destinationY = generateRandomNumber(-200, 0);
					aceAnimationIn.add(TweenMax.fromTo( circle, 1,{ x: 0, y: -100, scaleX: 0, scaleY: 0, alpha: 0 },{ x: destinationX, y: destinationY, scaleX: 1, scaleY: 1, alpha: 1, ease: Quart.easeOut }), 1.5);
				}

				// MOVE PANELS
				aceAnimationIn.add(TweenMax.fromTo( aceRectArray[0], 2.25,{ x: 0, y: 1500 },{ x: 0, y: 50, ease: Expo.easeOut }), 0);
				aceAnimationIn.add(TweenMax.fromTo( aceRectArray[1], 2.25,{ x: 0, y: 1500 },{ x: 0, y: 50, ease: Expo.easeOut }), 0);
				aceAnimationIn.add(TweenMax.fromTo( aceRectArray[2], 2.25,{ x: 0, y: 1500 },{ x: 0, y: 50, ease: Expo.easeOut }), 0);

				aceAnimationIn.add(TweenMax.fromTo( aceRectArray[0], 1.5,{ scaleY: 2, rotation: (25 * toRAD), alpha: 0 },{ scaleY: 1, rotation: (-15 * toRAD), alpha: .5, ease: Quad.easeInOut }), 0);
				aceAnimationIn.add(TweenMax.fromTo( aceRectArray[1], 1.5,{ scaleY: 2, rotation: (25* toRAD), alpha: 0 },{ scaleY: .5, rotation: (-15 * toRAD), alpha: .5, ease: Quad.easeInOut }), 0);
				aceAnimationIn.add(TweenMax.fromTo( aceRectArray[2], 1.5,{ scaleY: 2, rotation: (25 * toRAD), alpha: 0 },{ scaleY: .25, rotation: (-15 * toRAD), alpha: .5, ease: Quad.easeInOut }), 0);

				aceAnimationIn.add(TweenMax.to( aceRectArray[0], 1.0,{ scaleY: .5, rotation: (-10 * toRAD), ease: Quad.easeInOut }), 1.5);
				aceAnimationIn.add(TweenMax.to( aceRectArray[1], 1.0,{ scaleY: .25, rotation: (-10 * toRAD), ease: Quad.easeInOut }), 1.5);
				aceAnimationIn.add(TweenMax.to( aceRectArray[2], 1.0,{ scaleY: 0, rotation: (-10 * toRAD), ease: Quad.easeInOut }), 1.5);
				aceAnimationIn.add(TweenMax.to( aceRectArray[0], .5,{ alpha: 0 }), 1.5);
				aceAnimationIn.add(TweenMax.to( aceRectArray[1], .5,{ alpha: 0 }), 1.5);
				aceAnimationIn.add(TweenMax.to( aceRectArray[2], .5,{alpha: 0 }), 1.5);

				// FINAL CIRCLE EXPLOSION
				aceAnimationIn.add(TweenMax.fromTo( aceCircle1, 1.25,{ x: 250, y: 50, scaleX: 0, scaleY: 0},{ x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Expo.easeOut }), 1.75);
				aceAnimationIn.add(TweenMax.fromTo( aceCircle2, 1.5,{ x: 250, y: 50, scaleX: 0, scaleY: 0},{ x: -10, y: -10, scaleX: 1, scaleY: 1, ease: Elastic.easeOut }), 1.75);
				aceAnimationIn.add(TweenMax.fromTo( aceCircle3, 1.75,{ x: 250, y: 50, scaleX: 0, scaleY: 0},{ x: 5, y: 2, scaleX: 1, scaleY: 1, ease: Elastic.easeOut }), 1.75);
				aceAnimationIn.add(TweenMax.fromTo( aceCircle4, 1.25,{ x: 250, y: 50, scaleX: 0, scaleY: 0},{ x: -25, y: -25, scaleX: 1, scaleY: 1, ease: Elastic.easeOut }), 1.75);
				aceAnimationIn.add(TweenMax.fromTo( aceCircle5, 1.5,{ x: 250, y: 50, scaleX: 0, scaleY: 0},{ x: 50, y: 70, scaleX: 1, scaleY: 1, ease: Elastic.easeOut }), 1.75);

				aceAnimationIn.add(TweenMax.fromTo( aceTitle, 2,{ x: 50, y: 0, scaleX: 0, scaleY: 0, rotation: 2, alpha: 0 },{ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, alpha: 1, ease: Elastic.easeOut }), 1.75);

				aceAnimationIn.add(TweenMax.fromTo( aceLightning1, 1.0,{ scaleX: 0, scaleY: 0, x: 250, y: -180 },{ scaleX: 1, scaleY: 1, x: 40, y: -130, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning2, 1.15,{ scaleX: 0, scaleY: 0, x: 250, y: -150 },{ scaleX: 1, scaleY: 1, x: 100, y: -100, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning3, 1.25,{ scaleX: 0, scaleY: 0, x: 250, y: -110 },{ scaleX: 1, scaleY: 1, x: 140, y: -60, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning4, 1.75,{ scaleX: 0, scaleY: 0, x: 250, y: -40 },{ scaleX: 1, scaleY: 1, x: 160, y: 10, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning5, 1.45,{ scaleX: 0, scaleY: 0, x: 250, y: -30 },{ scaleX: 1, scaleY: 1, x: 100, y: 20, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning6, 1.55,{ scaleX: 0, scaleY: 0, x: 250, y: 40 },{ scaleX: 1, scaleY: 1, x: -60, y: 90, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning7, 1.65,{ scaleX: 0, scaleY: 0, x: 250, y: 10 },{ scaleX: 1, scaleY: 1, x: -120, y: 60, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning8, 1.75,{ scaleX: 0, scaleY: 0, x: 250, y: -10 },{ scaleX: 1, scaleY: 1, x: -170, y: 40, ease: Elastic.easeOut }), 1.80);
				aceAnimationIn.add(TweenMax.fromTo( aceLightning9, 1.85,{ scaleX: 0, scaleY: 0, x: 250, y: -40 },{ scaleX: 1, scaleY: 1, x: -70, y: -90, ease: Elastic.easeOut }), 1.80);

				// SHAKE RATTLE & ROLL
				aceAnimationIn.add(TweenMax.fromTo( momentAce, 0.75,{ x: 5, y: 5 },{ x: 0, y: 0, ease: RoughEase.ease.config({ strength: 15, points: 50 }) }), 1.75);
				aceAnimationIn.add(TweenMax.to( momentAce, 0,{ x: 0, y: 0 }), 0);

				aceAnimationIn.timeScale(1.25);
				aceAnimationIn.play();

				momentAce.visible = true;

				animationTimer = setTimeout(destroyAce,4000);
			}

			function destroyAce() {

				function scaleZero(){
					TweenMax.to(["#visualizer", "ani-ace", "#icon_ace"], 2, {scale:0});
					TweenMax.set(["#visualizer", "ani-ace"],{display:"none", delay:2});
				}
				aceAnimationOut =  new TimelineMax({ paused: true, onComplete:scaleZero});

				//////////////// PARTICLE STUFF /////////////////
				aceAnimationOut.add(TweenMax.to( aceParticleContainer, 1.0, { alpha: 0 }), 0);
				aceAnimationOut.add(TweenMax.to( aceEm_TennisBalls.doc, 1.0,{ scaleX: 0, scaleY: 0, ease: Quart.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceEm_ThinShards.doc, 1.0,{ x: 600, y: -600,ease: Quart.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceEm_LightningBolts.doc, 1.0,{ x: -600, y: 600, ease: Quart.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceEm_Circles.doc, 1.0,{ scaleX: 0.5, scaleY: 0.5, ease: Quart.easeInOut }), 0);
				/////////////////////////////////////////////////

				aceAnimationOut.add(TweenMax.to( aceCircle1, 1.1,{ x: 0, y: 0, scaleX: 0, scaleY: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceCircle2, 1.0,{ x: 0, y: 0, scaleX: 0, scaleY: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceCircle3, .9,{ x: 0, y: 0, scaleX: 0, scaleY: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceCircle4, .8,{ x: 0, y: 0, scaleX: 0, scaleY: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceCircle5, .7,{ x: 0, y: 0, scaleX: 0, scaleY: 0, ease: Expo.easeInOut }), 0);

				aceAnimationOut.add(TweenMax.to( aceTitle, .6,{ scaleX: 0, scaleY: 0, x: 0, y: 0, alpha: 0, ease: Expo.easeInOut }), 0);

				aceAnimationOut.add(TweenMax.to( aceLightning1, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning2, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning3, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning4, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning5, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning6, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning7, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning8, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);
				aceAnimationOut.add(TweenMax.to( aceLightning9, 1.0,{ scaleX: 0, scaleY: 0, x: 0, y: 0, ease: Expo.easeInOut }), 0);

				aceAnimationOut.add(TweenMax.fromTo( aceRectArray[0], .75,{ x: 500, y: -800, scaleY: 5, alpha: 0, rotation: (-15 * toRAD) },{ x: 0, y: 0, scaleY: 0, alpha: 1, rotation: (-15 * toRAD), ease: Expo.easeIn }), 0);
				aceAnimationOut.add(TweenMax.fromTo( aceRectArray[1], .75,{ x: -500, y: 800, scaleY: 5, alpha: 0, rotation: (-15 * toRAD) },{ x: 0, y: 0, scaleY: 0, alpha: 1, rotation: (-15 * toRAD), ease: Expo.easeIn }), 0);

				for (var i = 0; i < aceExplosionArray2.length; i++) {
					var circle = aceExplosionArray2[i];
					var duration = 1 + (i * .02);
					aceAnimationOut.add(TweenMax.to( circle, (duration),{ x: 0, y: 0, scaleX: 0, scaleY: 0, alpha: 0, ease: Expo.easeInOut }), 0);
				}

				aceAnimationOut.timeScale(1);
				aceAnimationOut.play();

				animationTimer = setTimeout(hideMoments, 2000);
			}



			function init(){
				stage = new PIXI.Stage(0xf6f6f6);
				renderer = new PIXI.autoDetectRenderer(800, 600,null,false,true);
				$("#visualizer").append(renderer.view);

				vizGroup = new PIXI.DisplayObjectContainer();
				stage.addChild(vizGroup);

				initBeast();

				$( window ).resize(onResize);
				$( window ).scroll(onScroll);
				onResize();

				requestAnimFrame(animate);
			}

			function onScroll(){
				updateViewportRect();
			}

			function animate() {
				renderer.render(stage);
				requestAnimationFrame( animate );
				drawBeast();
			}

			function onResize(){
				renderer.resize(window.innerWidth,window.innerHeight);
				vizGroup.x = renderer.width/2;
				vizGroup.y = renderer.height/2;
				resizeBeast();
			}

			init();
			//$(function(){
			//	init();
			//});

			$scope.ace = function(){
				explodeAce();

				return false;
			}

		}
	}
);
'use strict';

/**
 *  @ngdoc module
 *  @name pbshop.components.select
 */

/*
 [Process Step]

 Check Requirements
 Process payment
 */

/**************************************************************

 ### TODO ###
 **DOCUMENTATION AND DEMOS**

 -[ ] ng-modle with child mdOptions (basic)
 -[ ] ng-modle="foo" ng-model-options="{targetBy: ''}"

 **************************************************************/

angular.module('the-clean')

	.directive('tcOrder',OrderDirective)
	.directive('tcOrderHeader', OrderHeader)
	.directive('tcGetRequires', GetRequires)
	.provider('$tcOrder', SelectProvider);


function OrderDirective($tcOrder, $interpolate, $compile, $parse, $mdToast) {
	return {
		restrict: 'E',
        scope: {
            userInfo: '=userInfo'
        },
		templateUrl: 'modules/the-clean/directives/template/tc-order-ui-tpl.html',
		require: ['tcOrder'],
		compile: compile,
		controller: 'TheCleanCrudsController' //function(){}
	};

	function compile(element, attr){
		console.log(element);
		var labelEl=element.find('tc-order-label').remove();

		return function postLink(scope, element, attr, ctrls){

			scope.orderDate = moment()._d;
			scope.deliberyDate = moment()._d;
			scope.address = 'Not Yet';
			scope.numOrder = 1;
			scope.detailInfo = "빠른베송 부탁 드립니다.";
			scope.price = scope.numOrder * 900;

			scope.getTotal = function(){
				scope.price = scope.numOrder * 900;
			}

			var toastPosition = {
				bottom: true,
				top: false,
				left: false,
				right: true
			};
			var getToastPosition = function() {
				return Object.keys(toastPosition)
					.filter(function(pos) { return toastPosition[pos]; })
					.join(' ');
			};

			scope.createToast = function(){
				$mdToast.show({
					controller: function($scope, $mdToast) {
						$scope.closeToast = function() {
							$mdToast.hide();
						};
					},
					template: '<md-toast> <span flex>Submitted</span> <md-button ng-click="closeToast()">Close </md-button> </md-toast>',
					hideDelay: 6000,
					position: getToastPosition()
				});
			}
		}
	}

    function OrderDirectiveController($scope){
        console.log($scope.authentication);
    }
}
OrderDirective.$inject = ["$tcOrder", "$interpolate", "$compile", "$parse", "$mdToast"];

//SlideShow
function OrderHeader($mdTheming){
	return {
		restrict: 'E',
		link: function($scope, $element, $attr) {
			var progressBar = '<div id="progressBar"></div>';
			$element.append(progressBar);
			var images = $element.find('img');
			var tl = new TimelineMax({
				onReverseComplete:reverseRepeat,
				onReverseCompleteParams:['{self}'],
				onComplete:complete,
				onCompleteParams:['{self}']
			});
			function reverseRepeat(tl){
				tl.reverse(0);
			}
			function complete(tl){
				tl.restart();
				console.log('Complete');
			}

			function prepNext(timeline, slide){
				TweenMax.set(slide, {display:'none'});
			}
			var time = 3.2;
			var init = TweenMax.set(images, {display:"none"});
			var a1 = TweenMax.to(images[0], time,{autoAlpha:0, display:'block'});
			var a2 = TweenMax.to(images[1], time,{autoAlpha:0, display:'block'});
			var a3 = TweenMax.to(images[2], time,{autoAlpha:0, display:'block'});

			var slideTl1 = new TimelineMax({
				onComplete: prepNext,
				onCompleteParams: ["{self}", images[0]]
			});
			slideTl1
				.add(a1)
				.from($('#progressBar'), slideTl1.duration(), {scaleX:0, transformOrigin:"0px 0px", ease:Linear.easeNone}, 0);

			var slideTl2 = new TimelineMax({
				onComplete: prepNext,
				onCompleteParams: ["{self}", images[1]]
			});
			slideTl2
				.add(a2)
				.from($('#progressBar'), slideTl2.duration(), {scaleX:0, transformOrigin:"0px 0px", ease:Linear.easeNone}, 0);

			var slideTl3 = new TimelineMax({
				onComplete: prepNext,
				onCompleteParams: ["{self}", images[2]]
			});
			slideTl3
				.add(a3)
				.from($('#progressBar'), slideTl3.duration(), {scaleX:0, transformOrigin:"0px 0px", ease:Linear.easeNone}, 0);

			tl.set(images, {display:"none"}).add(slideTl1).add(slideTl2).add(slideTl3).play();
			$mdTheming($element);
		}
	};
}
OrderHeader.$inject = ["$mdTheming"];

function GetRequires($parse){
	return{
		restrict: 'E',
		require:['tcGetRequires', '?ngModel'],
		controller: GetRequiresController,
		link:{ pre: preLink }
	};

	function SelectMenuController($scope, $attrs, $element) {
		var self = this;
		self.isMultiple = angular.isDefined($attrs.multiple);
		// selected is an object with keys matching all of the selected options' hashed values
		self.selected = {};
		// options is an object with keys matching every option's hash value,
		// and values matching every option's controller.
		self.options = {};
	}

	function preLink(scope, element, attr, ctrls){
		var selectCtrl = ctrls[0];
		var ngModel = ctrls[1];

		element.on('click');
		element.on('keypress', keyListener);
		if (ngModel) selectCtrl.init(ngModel);
		configureAria();

		function configureAria() {
			element.attr({
				'id': 'select_menu_' + $mdUtil.nextUid(),
				'role': 'listbox',
				'aria-multiselectable': (selectCtrl.isMultiple ? 'true' : 'false')
			});
		}

		function keyListener(e) {
			if (e.keyCode == 13 || e.keyCode == 32) {
				clickListener(e);
			}
		}

		function clickListener(ev) {
			var option = $mdUtil.getClosest(ev.target, 'md-option');
			var optionCtrl = option && angular.element(option).data('$mdOptionController');
			if (!option || !optionCtrl) return;

			var optionHashKey = selectCtrl.hashGetter(optionCtrl.value);
			var isSelected = angular.isDefined(selectCtrl.selected[optionHashKey]);

			scope.$apply(function() {
				if (selectCtrl.isMultiple) {
					if (isSelected) {
						selectCtrl.deselect(optionHashKey);
					} else {
						selectCtrl.select(optionHashKey, optionCtrl.value);
					}
				} else {
					if (!isSelected) {
						selectCtrl.deselect( Object.keys(selectCtrl.selected)[0] );
						selectCtrl.select( optionHashKey, optionCtrl.value );
					}
				}
				selectCtrl.refreshViewValue();
			});
		}
	}
}
GetRequires.$inject = ["$parse"];

function SelectProvider($$interimElementProvider) {
	selectDefaultOptions.$inject = ["$tcOrder", "$mdConstant", "$$rAF", "$mdUtil", "$mdTheming", "$timeout"];
	return $$interimElementProvider('$tcOrder')
		.setDefaults({
			methods: ['target'],
			options: selectDefaultOptions
		});

	/* @ngInject */
	function selectDefaultOptions($tcOrder, $mdConstant, $$rAF, $mdUtil, $mdTheming, $timeout) {
		return {
			parent: 'body',
			onShow: onShow,
			onRemove: onRemove,
			hasBackdrop: true,
			disableParentScroll: $mdUtil.floatingScrollbars(),
			themable: true
		};

		function onShow(scope, element, opts) {
			if (!opts.target) {
				throw new Error('$tcOrder.show() expected a target element in options.target but got ' +
				'"' + opts.target + '"!');
			}

			angular.extend(opts, {
				isRemoved: false,
				target: angular.element(opts.target), //make sure it's not a naked dom node
				parent: angular.element(opts.parent),
				selectEl: element.find('md-select-menu'),
				contentEl: element.find('md-content'),
				backdrop: opts.hasBackdrop && angular.element('<md-backdrop class="md-select-backdrop">')
			});

			configureAria();

			element.removeClass('md-leave');

			var optionNodes = opts.selectEl[0].getElementsByTagName('md-option');

			if (opts.loadingAsync && opts.loadingAsync.then) {
				opts.loadingAsync.then(function() {
					scope.$$loadingAsyncDone = true;
					// Give ourselves two frames for the progress loader to clear out.
					$$rAF(function() {
						$$rAF(function() {
							// Don't go forward if the select has been removed in this time...
							if (opts.isRemoved) return;
							animateSelect(scope, element, opts);
						});
					});
				});
			}

			if (opts.disableParentScroll) {
				opts.disableTarget = opts.parent.find('md-content');
				if (!opts.disableTarget.length) opts.disableTarget = opts.parent;
				opts.lastOverflow = opts.disableTarget.css('overflow');
				opts.disableTarget.css('overflow', 'hidden');
			}
			// Only activate click listeners after a short time to stop accidental double taps/clicks
			// from clicking the wrong item
			$timeout(activateInteraction, 75, false);

			if (opts.backdrop) {
				$mdTheming.inherit(opts.backdrop, opts.parent);
				opts.parent.append(opts.backdrop);
			}
			opts.parent.append(element);

			// Give the select a frame to 'initialize' in the DOM,
			// so we can read its height/width/position
			$$rAF(function() {
				$$rAF(function() {
					if (opts.isRemoved) return;
					animateSelect(scope, element, opts);
				});
			});

			return $mdUtil.transitionEndPromise(opts.selectEl, {timeout: 350});

			function configureAria() {
				opts.selectEl.attr('aria-labelledby', opts.target.attr('id'));
				opts.target.attr('aria-owns', opts.selectEl.attr('id'));
				opts.target.attr('aria-expanded', 'true');
			}

			function activateInteraction() {
				if (opts.isRemoved) return;
				var selectCtrl = opts.selectEl.controller('mdSelectMenu') || {};
				element.addClass('md-clickable');

				opts.backdrop && opts.backdrop.on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					opts.restoreFocus = false;
					scope.$apply($tcOrder.cancel);
				});

				// Escape to close
				opts.selectEl.on('keydown', function(ev) {
					switch (ev.keyCode) {
						case $mdConstant.KEY_CODE.SPACE:
						case $mdConstant.KEY_CODE.ENTER:
							var option = $mdUtil.getClosest(ev.target, 'md-option');
							if (option) {
								opts.selectEl.triggerHandler({
									type: 'click',
									target: option
								});
								ev.preventDefault();
							}
							break;
						case $mdConstant.KEY_CODE.TAB:
						case $mdConstant.KEY_CODE.ESCAPE:
							ev.preventDefault();
							opts.restoreFocus = true;
							scope.$apply($tcOrder.cancel);
					}
				});

				// Cycling of options, and closing on enter
				opts.selectEl.on('keydown', function(ev) {
					switch (ev.keyCode) {
						case $mdConstant.KEY_CODE.UP_ARROW: return focusPrevOption();
						case $mdConstant.KEY_CODE.DOWN_ARROW: return focusNextOption();
					}
				});

				function focusOption(direction) {
					var optionsArray = nodesToArray(optionNodes);
					var index = optionsArray.indexOf(opts.focusedNode);
					if (index === -1) {
						// We lost the previously focused element, reset to first option
						index = 0;
					} else if (direction === 'next' && index < optionsArray.length - 1) {
						index++;
					} else if (direction === 'prev' && index > 0) {
						index--;
					}
					var newOption = opts.focusedNode = optionsArray[index];
					newOption && newOption.focus();
				}
				function focusNextOption() {
					focusOption('next');
				}
				function focusPrevOption() {
					focusOption('prev');
				}

				if (!selectCtrl.isMultiple) {
					opts.selectEl.on('click', closeMenu);
					opts.selectEl.on('keydown', function(e) {
						if (e.keyCode == 32 || e.keyCode == 13) {
							closeMenu();
						}
					});
				}
				function closeMenu() {
					opts.restoreFocus = true;
					scope.$evalAsync(function() {
						$tcOrder.hide(selectCtrl.ngModel.$viewValue);
					});
				}
			}
		}

		function onRemove(scope, element, opts) {
			opts.isRemoved = true;
			element.addClass('md-leave')
				.removeClass('md-clickable');
			opts.target.attr('aria-expanded', 'false');

			if (opts.disableParentScroll && $mdUtil.floatingScrollbars()) {
				opts.disableTarget.css('overflow', opts.lastOverflow);
				delete opts.lastOverflow;
				delete opts.disableTarget;
			}

			var mdSelect = opts.selectEl.controller('mdSelect');
			if (mdSelect) {
				mdSelect.setLabelText(opts.selectEl.controller('mdSelectMenu').selectedLabels());
			}

			return $mdUtil.transitionEndPromise(element, { timeout: 350 }).then(function() {
				element.removeClass('md-active');
				opts.parent[0].removeChild(element[0]); // use browser to avoid $destroy event
				opts.backdrop && opts.backdrop.remove();
				if (opts.restoreFocus) opts.target.focus();
			});
		}

		function animateSelect(scope, element, opts) {
			var containerNode = element[0],
				targetNode = opts.target[0],
				parentNode = opts.parent[0],
				selectNode = opts.selectEl[0],
				contentNode = opts.contentEl[0],
				parentRect = parentNode.getBoundingClientRect(),
				targetRect = $mdUtil.clientRect(targetNode, parentNode),
				shouldOpenAroundTarget = false,
				bounds = {
					left: parentNode.scrollLeft + SELECT_EDGE_MARGIN,
					top: parentNode.scrollTop + SELECT_EDGE_MARGIN,
					bottom: parentRect.height + parentNode.scrollTop - SELECT_EDGE_MARGIN,
					right: parentRect.width - SELECT_EDGE_MARGIN
				},
				spaceAvailable = {
					top: targetRect.top - bounds.top,
					left: targetRect.left - bounds.left,
					right: bounds.right - (targetRect.left + targetRect.width),
					bottom: bounds.bottom - (targetRect.top + targetRect.height)
				},
				maxWidth = parentRect.width - SELECT_EDGE_MARGIN * 2,
				isScrollable = contentNode.scrollHeight > contentNode.offsetHeight,
				selectedNode = selectNode.querySelector('md-option[selected]'),
				optionNodes = selectNode.getElementsByTagName('md-option'),
				optgroupNodes = selectNode.getElementsByTagName('md-optgroup');


			var centeredNode;
			// If a selected node, center around that
			if (selectedNode) {
				centeredNode = selectedNode;
				// If there are option groups, center around the first option group
			} else if (optgroupNodes.length) {
				centeredNode = optgroupNodes[0];
				// Otherwise, center around the first optionNode
			} else if (optionNodes.length){
				centeredNode = optionNodes[0];
				// In case there are no options, center on whatever's in there... (eg progress indicator)
			} else {
				centeredNode = contentNode.firstElementChild || contentNode;
			}

			if (contentNode.offsetWidth > maxWidth) {
				contentNode.style['max-width'] = maxWidth + 'px';
			}
			if (shouldOpenAroundTarget) {
				contentNode.style['min-width'] = targetRect.width + 'px';
			}

			// Remove padding before we compute the position of the menu
			if (isScrollable) {
				selectNode.classList.add('md-overflow');
			}

			// Get the selectMenuRect *after* max-width is possibly set above
			var selectMenuRect = selectNode.getBoundingClientRect();
			var centeredRect = getOffsetRect(centeredNode);

			if (centeredNode) {
				var centeredStyle = window.getComputedStyle(centeredNode);
				centeredRect.paddingLeft = parseInt(centeredStyle.paddingLeft, 10) || 0;
				centeredRect.paddingRight = parseInt(centeredStyle.paddingRight, 10) || 0;
			}

			var focusedNode = centeredNode;
			if ((focusedNode.tagName || '').toUpperCase() === 'MD-OPTGROUP') {
				focusedNode = optionNodes[0] || contentNode.firstElementChild || contentNode;
			}
			if (focusedNode) {
				opts.focusedNode = focusedNode;
				focusedNode.focus();
			}

			if (isScrollable) {
				var scrollBuffer = contentNode.offsetHeight / 2;
				contentNode.scrollTop = centeredRect.top + centeredRect.height / 2 - scrollBuffer;

				if (spaceAvailable.top < scrollBuffer) {
					contentNode.scrollTop = Math.min(
						centeredRect.top,
						contentNode.scrollTop + scrollBuffer - spaceAvailable.top
					);
				} else if (spaceAvailable.bottom < scrollBuffer) {
					contentNode.scrollTop = Math.max(
						centeredRect.top + centeredRect.height - selectMenuRect.height,
						contentNode.scrollTop - scrollBuffer + spaceAvailable.bottom
					);
				}
			}

			var left, top, transformOrigin;
			if (shouldOpenAroundTarget) {
				left = targetRect.left;
				top = targetRect.top + targetRect.height;
				transformOrigin = '50% 0';
				if (top + selectMenuRect.height > bounds.bottom) {
					top = targetRect.top - selectMenuRect.height;
					transformOrigin = '50% 100%';
				}
			} else {
				left = targetRect.left + centeredRect.left - centeredRect.paddingLeft;
				top = targetRect.top + targetRect.height / 2 - centeredRect.height / 2 -
				centeredRect.top + contentNode.scrollTop;

				transformOrigin = (centeredRect.left + targetRect.width / 2) + 'px ' +
				(centeredRect.top + centeredRect.height / 2 - contentNode.scrollTop) + 'px 0px';

				containerNode.style.minWidth = targetRect.width + centeredRect.paddingLeft +
				centeredRect.paddingRight + 'px';
			}

			// Keep left and top within the window
			var containerRect = containerNode.getBoundingClientRect();
			containerNode.style.left = clamp(bounds.left, left, bounds.right - containerRect.width) + 'px';
			containerNode.style.top = clamp(bounds.top, top, bounds.bottom - containerRect.height) + 'px';
			selectNode.style[$mdConstant.CSS.TRANSFORM_ORIGIN] = transformOrigin;

			selectNode.style[$mdConstant.CSS.TRANSFORM] = 'scale(' +
			Math.min(targetRect.width / selectMenuRect.width, 1.0) + ',' +
			Math.min(targetRect.height / selectMenuRect.height, 1.0) +
			')';

			$$rAF(function() {
				element.addClass('md-active');
				selectNode.style[$mdConstant.CSS.TRANSFORM] = '';
			});
		}

	}

	function clamp(min, n, max) {
		return Math.min(max, Math.max(n, min));
	}

	function getOffsetRect(node) {
		return node ? {
			left: node.offsetLeft,
			top: node.offsetTop,
			width: node.offsetWidth,
			height: node.offsetHeight
		} : { left: 0, top: 0, width: 0, height: 0 };
	}
}
SelectProvider.$inject = ["$$interimElementProvider"];

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
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
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);