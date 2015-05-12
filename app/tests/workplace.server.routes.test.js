'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Workplace = mongoose.model('Workplace'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, workplace;

/**
 * Workplace routes tests
 */
describe('Workplace CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Workplace
		user.save(function() {
			workplace = {
				name: 'Workplace Name'
			};

			done();
		});
	});

	it('should be able to save Workplace instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workplace
				agent.post('/workplaces')
					.send(workplace)
					.expect(200)
					.end(function(workplaceSaveErr, workplaceSaveRes) {
						// Handle Workplace save error
						if (workplaceSaveErr) done(workplaceSaveErr);

						// Get a list of Workplaces
						agent.get('/workplaces')
							.end(function(workplacesGetErr, workplacesGetRes) {
								// Handle Workplace save error
								if (workplacesGetErr) done(workplacesGetErr);

								// Get Workplaces list
								var workplaces = workplacesGetRes.body;

								// Set assertions
								(workplaces[0].user._id).should.equal(userId);
								(workplaces[0].name).should.match('Workplace Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Workplace instance if not logged in', function(done) {
		agent.post('/workplaces')
			.send(workplace)
			.expect(401)
			.end(function(workplaceSaveErr, workplaceSaveRes) {
				// Call the assertion callback
				done(workplaceSaveErr);
			});
	});

	it('should not be able to save Workplace instance if no name is provided', function(done) {
		// Invalidate name field
		workplace.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workplace
				agent.post('/workplaces')
					.send(workplace)
					.expect(400)
					.end(function(workplaceSaveErr, workplaceSaveRes) {
						// Set message assertion
						(workplaceSaveRes.body.message).should.match('Please fill Workplace name');
						
						// Handle Workplace save error
						done(workplaceSaveErr);
					});
			});
	});

	it('should be able to update Workplace instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workplace
				agent.post('/workplaces')
					.send(workplace)
					.expect(200)
					.end(function(workplaceSaveErr, workplaceSaveRes) {
						// Handle Workplace save error
						if (workplaceSaveErr) done(workplaceSaveErr);

						// Update Workplace name
						workplace.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Workplace
						agent.put('/workplaces/' + workplaceSaveRes.body._id)
							.send(workplace)
							.expect(200)
							.end(function(workplaceUpdateErr, workplaceUpdateRes) {
								// Handle Workplace update error
								if (workplaceUpdateErr) done(workplaceUpdateErr);

								// Set assertions
								(workplaceUpdateRes.body._id).should.equal(workplaceSaveRes.body._id);
								(workplaceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Workplaces if not signed in', function(done) {
		// Create new Workplace model instance
		var workplaceObj = new Workplace(workplace);

		// Save the Workplace
		workplaceObj.save(function() {
			// Request Workplaces
			request(app).get('/workplaces')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Workplace if not signed in', function(done) {
		// Create new Workplace model instance
		var workplaceObj = new Workplace(workplace);

		// Save the Workplace
		workplaceObj.save(function() {
			request(app).get('/workplaces/' + workplaceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', workplace.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Workplace instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workplace
				agent.post('/workplaces')
					.send(workplace)
					.expect(200)
					.end(function(workplaceSaveErr, workplaceSaveRes) {
						// Handle Workplace save error
						if (workplaceSaveErr) done(workplaceSaveErr);

						// Delete existing Workplace
						agent.delete('/workplaces/' + workplaceSaveRes.body._id)
							.send(workplace)
							.expect(200)
							.end(function(workplaceDeleteErr, workplaceDeleteRes) {
								// Handle Workplace error error
								if (workplaceDeleteErr) done(workplaceDeleteErr);

								// Set assertions
								(workplaceDeleteRes.body._id).should.equal(workplaceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Workplace instance if not signed in', function(done) {
		// Set Workplace user 
		workplace.user = user;

		// Create new Workplace model instance
		var workplaceObj = new Workplace(workplace);

		// Save the Workplace
		workplaceObj.save(function() {
			// Try deleting Workplace
			request(app).delete('/workplaces/' + workplaceObj._id)
			.expect(401)
			.end(function(workplaceDeleteErr, workplaceDeleteRes) {
				// Set message assertion
				(workplaceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Workplace error error
				done(workplaceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Workplace.remove().exec();
		done();
	});
});