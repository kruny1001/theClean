'use strict';

(function() {
	// Workplaces Controller Spec
	describe('Workplaces Controller Tests', function() {
		// Initialize global variables
		var WorkplacesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Workplaces controller.
			WorkplacesController = $controller('WorkplacesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Workplace object fetched from XHR', inject(function(Workplaces) {
			// Create sample Workplace using the Workplaces service
			var sampleWorkplace = new Workplaces({
				name: 'New Workplace'
			});

			// Create a sample Workplaces array that includes the new Workplace
			var sampleWorkplaces = [sampleWorkplace];

			// Set GET response
			$httpBackend.expectGET('workplaces').respond(sampleWorkplaces);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workplaces).toEqualData(sampleWorkplaces);
		}));

		it('$scope.findOne() should create an array with one Workplace object fetched from XHR using a workplaceId URL parameter', inject(function(Workplaces) {
			// Define a sample Workplace object
			var sampleWorkplace = new Workplaces({
				name: 'New Workplace'
			});

			// Set the URL parameter
			$stateParams.workplaceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/workplaces\/([0-9a-fA-F]{24})$/).respond(sampleWorkplace);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workplace).toEqualData(sampleWorkplace);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Workplaces) {
			// Create a sample Workplace object
			var sampleWorkplacePostData = new Workplaces({
				name: 'New Workplace'
			});

			// Create a sample Workplace response
			var sampleWorkplaceResponse = new Workplaces({
				_id: '525cf20451979dea2c000001',
				name: 'New Workplace'
			});

			// Fixture mock form input values
			scope.name = 'New Workplace';

			// Set POST response
			$httpBackend.expectPOST('workplaces', sampleWorkplacePostData).respond(sampleWorkplaceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Workplace was created
			expect($location.path()).toBe('/workplaces/' + sampleWorkplaceResponse._id);
		}));

		it('$scope.update() should update a valid Workplace', inject(function(Workplaces) {
			// Define a sample Workplace put data
			var sampleWorkplacePutData = new Workplaces({
				_id: '525cf20451979dea2c000001',
				name: 'New Workplace'
			});

			// Mock Workplace in scope
			scope.workplace = sampleWorkplacePutData;

			// Set PUT response
			$httpBackend.expectPUT(/workplaces\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/workplaces/' + sampleWorkplacePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid workplaceId and remove the Workplace from the scope', inject(function(Workplaces) {
			// Create new Workplace object
			var sampleWorkplace = new Workplaces({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Workplaces array and include the Workplace
			scope.workplaces = [sampleWorkplace];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/workplaces\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWorkplace);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.workplaces.length).toBe(0);
		}));
	});
}());