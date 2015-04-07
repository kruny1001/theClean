'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies =
		['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'
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
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
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

angular.module('the-clean').controller('TcOrderController', ['$scope',
	function($scope) {
		// Tc order controller logic
		// ...
	}
]);
'use strict';

angular.module('the-clean').controller('TheCleanController', ['$scope','Authentication',
	function($scope, Authentication) {
		// The clean controller logic
		// ...
        $scope.authentication = Authentication;
        $scope.toppings = [
            { category: 'meat', name: 'Pepperoni' },
            { category: 'meat', name: 'Sausage' },
            { category: 'meat', name: 'Ground Beef' },
            { category: 'meat', name: 'Bacon' },
            { category: 'veg', name: 'Mushrooms' },
            { category: 'veg', name: 'Onion' },
            { category: 'veg', name: 'Green Pepper' },
            { category: 'veg', name: 'Green Olives' },
        ];

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

//        //All code created by Blake Bowen
////Forked from: http://codepen.io/osublake/pen/RNLdpz/
//
//// GRID OPTIONS
//        var rowSize   = 100;
//        var colSize   = 100;
//        var gutter    = 7;     // Spacing between tiles
//        var numTiles  = 25;    // Number of tiles to initially populate the grid with
//        var fixedSize = false; // When true, each tile's colspan will be fixed to 1
//        var oneColumn = false; // When true, grid will only have 1 column and tiles have fixed colspan of 1
//        var threshold = "50%"; // This is amount of overlap between tiles needed to detect a collision
//
//        var $add  = $("#add");
//        var $list = $("#list");
//        var $mode = $("input[name='layout']");
//
//// Live node list of tiles
//        var tiles  = $list[0].getElementsByClassName("tile");
//        var label  = 1;
//        var zIndex = 1000;
//
//        var startWidth  = "100%";
//        var startSize   = colSize;
//        var singleWidth = colSize * 3;
//
//        var colCount   = null;
//        var rowCount   = null;
//        var gutterStep = null;
//
//        var shadow1 = "0 1px 3px  0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.6)";
//        var shadow2 = "0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)";
//
//        $(window).resize(resize);
//        $add.click(createTile);
//        $mode.change(init);
//
//        init();
//
//// ========================================================================
////  INIT
//// ========================================================================
//        function init() {
//            var width = startWidth;
//
//            // This value is defined when this function
//            // is fired by a radio button change event
//            switch (this.value) {
//                case "mixed":
//                    fixedSize = false;
//                    oneColumn = false;
//                    colSize   = startSize;
//                    break;
//                case "fixed":
//                    fixedSize = true;
//                    oneColumn = false;
//                    colSize   = startSize;
//                    break;
//                case "column":
//                    fixedSize = false;
//                    oneColumn = true;
//                    width     = singleWidth;
//                    colSize   = singleWidth;
//                    break;
//            }
//
//            $(".tile").remove();
//
//            TweenLite.to($list, 0.2, { width: width });
//            TweenLite.delayedCall(0.25, populateBoard);
//
//            function populateBoard() {
//                label = 1;
//                resize();
//                for (var i = 0; i < numTiles; i++) {
//                    createTile();
//                }
//            }
//        }
//
//
//// ========================================================================
////  RESIZE
//// ========================================================================
//        function resize() {
//
//            colCount   = oneColumn ? 1 : Math.floor($list.outerWidth() / (colSize + gutter));
//            gutterStep = colCount == 1 ? gutter : (gutter * (colCount - 1) / colCount);
//            rowCount   = 0;
//
//            layoutInvalidated();
//        }
//
//
//// ========================================================================
////  CHANGE POSITION
//// ========================================================================
//        function changePosition(from, to, rowToUpdate) {
//
//            var $tiles = $(".tile");
//            var insert = from > to ? "insertBefore" : "insertAfter";
//
//            // Change DOM positions
//            $tiles.eq(from)[insert]($tiles.eq(to));
//
//            layoutInvalidated(rowToUpdate);
//        }
//
//// ========================================================================
////  CREATE TILE
//// ========================================================================
//        function createTile() {
//            var colspan = fixedSize || oneColumn ? 1 : Math.floor(Math.random() * 2) + 1;
//            var element = $("<div></div>").addClass("tile").html(label++);
//            var lastX   = 0;
//
//            Draggable.create(element, {
//                onDrag      : onDrag,
//                onClick     : onClick,
//                onPress     : onPress,
//                onRelease   : onRelease,
//                zIndexBoost : false
//            });
//
//            // NOTE: Leave rowspan set to 1 because this demo
//            // doesn't calculate different row heights
//            var tile = {
//                col        : null,
//                colspan    : colspan,
//                element    : element,
//                height     : 0,
//                inBounds   : true,
//                index      : null,
//                isDragging : false,
//                lastIndex  : null,
//                newTile    : true,
//                positioned : false,
//                row        : null,
//                rowspan    : 1,
//                width      : 0,
//                x          : 0,
//                y          : 0
//            };
//
//            // Add tile properties to our element for quick lookup
//            element[0].tile = tile;
//
//            $list.append(element);
//            layoutInvalidated();
//
//            function onClick(){
//                console.log(this.target);
//                //TweenMax.to(this.target, 0.5, {scale:4});
//                console.log('clicked');
//            }
//
//            function onPress() {
//
//                lastX = this.x;
//                tile.isDragging = true;
//                tile.lastIndex  = tile.index;
//
//                TweenLite.to(element, 0.2, {
//                    autoAlpha : 0.75,
//                    boxShadow : shadow2,
//                    scale     : 0.95,
//                    zIndex    : "+=1000"
//                });
//            }
//
//            function onDrag() {
//
//                // Move to end of list if not in bounds
//                if (!this.hitTest($list, 0)) {
//                    tile.inBounds = false;
//                    changePosition(tile.index, tiles.length - 1);
//                    return;
//                }
//
//                tile.inBounds = true;
//
//                for (var i = 0; i < tiles.length; i++) {
//
//                    // Row to update is used for a partial layout update
//                    // Shift left/right checks if the tile is being dragged
//                    // towards the the tile it is testing
//                    var testTile    = tiles[i].tile;
//                    var onSameRow   = (tile.row === testTile.row);
//                    var rowToUpdate = onSameRow ? tile.row : -1;
//                    var shiftLeft   = onSameRow ? (this.x < lastX && tile.index > i) : true;
//                    var shiftRight  = onSameRow ? (this.x > lastX && tile.index < i) : true;
//                    var validMove   = (testTile.positioned && (shiftLeft || shiftRight));
//
//                    if (this.hitTest(tiles[i], threshold) && validMove) {
//                        changePosition(tile.index, i, rowToUpdate);
//                        break;
//                    }
//                }
//
//                lastX = this.x;
//            }
//
//            function onRelease() {
//
//                // Move tile back to last position if released out of bounds
//                this.hitTest($list, 0)
//                    ? layoutInvalidated()
//                    : changePosition(tile.index, tile.lastIndex);
//
//                TweenLite.to(element, 0.2, {
//                    autoAlpha : 1,
//                    boxShadow: shadow1,
//                    scale     : 1,
//                    x         : tile.x,
//                    y         : tile.y,
//                    zIndex    : ++zIndex
//                });
//
//                tile.isDragging = false;
//            }
//        }
//
//// ========================================================================
////  LAYOUT INVALIDATED
//// ========================================================================
//        function layoutInvalidated(rowToUpdate) {
//
//            var timeline = new TimelineMax();
//            var partialLayout = (rowToUpdate > -1);
//
//            var height = 0;
//            var col    = 0;
//            var row    = 0;
//            var time   = 0.35;
//
//            $(".tile").each(function(index, element) {
//
//                var tile    = this.tile;
//                var oldRow  = tile.row;
//                var oldCol  = tile.col;
//                var newTile = tile.newTile;
//
//                // PARTIAL LAYOUT: This condition can only occur while a tile is being
//                // dragged. The purpose of this is to only swap positions within a row,
//                // which will prevent a tile from jumping to another row if a space
//                // is available. Without this, a large tile in column 0 may appear
//                // to be stuck if hit by a smaller tile, and if there is space in the
//                // row above for the smaller tile. When the user stops dragging the
//                // tile, a full layout update will happen, allowing tiles to move to
//                // available spaces in rows above them.
//                if (partialLayout) {
//                    row = tile.row;
//                    if (tile.row !== rowToUpdate) return;
//                }
//
//                // Update trackers when colCount is exceeded
//                if (col + tile.colspan > colCount) {
//                    col = 0; row++;
//                }
//
//                $.extend(tile, {
//                    col    : col,
//                    row    : row,
//                    index  : index,
//                    x      : col * gutterStep + (col * colSize),
//                    y      : row * gutterStep + (row * rowSize),
//                    width  : tile.colspan * colSize + ((tile.colspan - 1) * gutterStep),
//                    height : tile.rowspan * rowSize
//                });
//
//                col += tile.colspan;
//
//                // If the tile being dragged is in bounds, set a new
//                // last index in case it goes out of bounds
//                if (tile.isDragging && tile.inBounds) {
//                    tile.lastIndex = index;
//                }
//
//                if (newTile) {
//
//                    // Clear the new tile flag
//                    tile.newTile = false;
//
//                    var from = {
//                        autoAlpha : 0,
//                        boxShadow : shadow1,
//                        height    : tile.height,
//                        scale     : 0,
//                        width     : tile.width
//                    };
//
//                    var to = {
//                        autoAlpha : 1,
//                        scale     : 1,
//                        zIndex    : zIndex
//                    }
//
//                    timeline.fromTo(element, time, from, to, "reflow");
//                }
//
//                // Don't animate the tile that is being dragged and
//                // only animate the tiles that have changes
//                if (!tile.isDragging && (oldRow !== tile.row || oldCol !== tile.col)) {
//
//                    var duration = newTile ? 0 : time;
//
//                    // Boost the z-index for tiles that will travel over
//                    // another tile due to a row change
//                    if (oldRow !== tile.row) {
//                        timeline.set(element, { zIndex: ++zIndex }, "reflow");
//                    }
//
//                    timeline.to(element, duration, {
//                        x : tile.x,
//                        y : tile.y,
//                        onComplete : function() { tile.positioned = true; },
//                        onStart    : function() { tile.positioned = false; }
//                    }, "reflow");
//                }
//            });
//
//            // If the row count has changed, change the height of the container
//            if (row !== rowCount) {
//                rowCount = row;
//                height   = rowCount * gutterStep + (++row * rowSize);
//                timeline.to($list, 0.2, { height: height }, "reflow");
//            }
//        }

    }
]);

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
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
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