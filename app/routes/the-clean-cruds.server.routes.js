'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var theCleanCruds = require('../../app/controllers/the-clean-cruds.server.controller');

	// The clean cruds Routes
	app.route('/the-clean-cruds')
		.get(theCleanCruds.list)
		.post(users.requiresLogin, theCleanCruds.create);

	app.route('/the-clean-cruds/:theCleanCrudId')
		.get(theCleanCruds.read)
		.put(users.requiresLogin, theCleanCruds.hasAuthorization, theCleanCruds.update)
		.delete(users.requiresLogin, theCleanCruds.hasAuthorization, theCleanCruds.delete);

	// Finish by binding the The clean crud middleware
	app.param('theCleanCrudId', theCleanCruds.theCleanCrudByID);
};
