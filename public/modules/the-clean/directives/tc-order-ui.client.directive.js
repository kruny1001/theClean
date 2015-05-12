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


function OrderDirective($tcOrder, $interpolate, $compile, $parse, $mdToast, $mdDialog) {
	return {
		restrict: 'E',
        scope: {
            userInfo: '=userInfo'
        },
		templateUrl: 'modules/the-clean/directives/template/tc-order-ui-tpl.html',
		require: ['tcOrder'],
		compile: compile,
		controller: 'TheCleanCrudsController'
	};

	function compile(element, attr){
		console.log(element);
		var labelEl=element.find('tc-order-label').remove();

		return function postLink(scope, element, attr, ctrls){

            var showConfirm = function(){
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'modules/the-clean/directives/template/dialog/addrAdd.tmpl.html',
                })
                    .then(function(answer) {
                        scope.address = answer;
                    }, function() {
                        scope.alert = 'You cancelled the dialog.';
                    });
            }

            var userInfo = scope.userInfo.user;
            if(userInfo.addr === undefined){
                console.log('Need Address');
                scope.address = '주소가 필요 합니다.';
                showConfirm();


                // Open dialog

            }else{
                console.log('Already have Address');
                scope.address = userInfo.addr;
            }

			scope.orderDate = moment()._d;
			scope.deliberyDate = moment()._d;
			//scope.address = 'Not Yet';
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

function SelectProvider($$interimElementProvider) {
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
