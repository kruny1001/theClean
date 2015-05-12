'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var workplaces = require('../../app/controllers/workplaces.server.controller');

	// Workplaces Routes
	app.route('/workplaces')
		.get(workplaces.list)
		.post(users.requiresLogin, workplaces.create);

	app.route('/workplaces/:workplaceId')
		.get(workplaces.read)
		.put(users.requiresLogin, workplaces.hasAuthorization, workplaces.update)
		.delete(users.requiresLogin, workplaces.hasAuthorization, workplaces.delete);

	// Finish by binding the Workplace middleware
	app.param('workplaceId', workplaces.workplaceByID);
};
