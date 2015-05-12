'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Workplace = mongoose.model('Workplace'),
	_ = require('lodash');

/**
 * Create a Workplace
 */
exports.create = function(req, res) {
	var workplace = new Workplace(req.body);
	workplace.user = req.user;

	workplace.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workplace);
		}
	});
};

/**
 * Show the current Workplace
 */
exports.read = function(req, res) {
	res.jsonp(req.workplace);
};

/**
 * Update a Workplace
 */
exports.update = function(req, res) {
	var workplace = req.workplace ;

	workplace = _.extend(workplace , req.body);

	workplace.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workplace);
		}
	});
};

/**
 * Delete an Workplace
 */
exports.delete = function(req, res) {
	var workplace = req.workplace ;

	workplace.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workplace);
		}
	});
};

/**
 * List of Workplaces
 */
exports.list = function(req, res) { 
	Workplace.find().sort('-created').populate('user', 'displayName').exec(function(err, workplaces) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workplaces);
		}
	});
};

/**
 * Workplace middleware
 */
exports.workplaceByID = function(req, res, next, id) { 
	Workplace.findById(id).populate('user', 'displayName').exec(function(err, workplace) {
		if (err) return next(err);
		if (! workplace) return next(new Error('Failed to load Workplace ' + id));
		req.workplace = workplace ;
		next();
	});
};

/**
 * Workplace authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.workplace.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
