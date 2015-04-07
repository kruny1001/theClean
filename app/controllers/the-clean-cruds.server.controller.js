'use strict';

/**
 * Module dependencies. //
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	TheCleanCrud = mongoose.model('TheCleanCrud'),
	_ = require('lodash');

/**
 * Create a The clean crud
 */
exports.create = function(req, res) {
	var theCleanCrud = new TheCleanCrud(req.body);
	theCleanCrud.user = req.user;

	theCleanCrud.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(theCleanCrud);
		}
	});
};

/**
 * Show the current The clean crud
 */
exports.read = function(req, res) {
	res.jsonp(req.theCleanCrud);
};

/**
 * Update a The clean crud
 */
exports.update = function(req, res) {
	var theCleanCrud = req.theCleanCrud ;

	theCleanCrud = _.extend(theCleanCrud , req.body);

	theCleanCrud.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(theCleanCrud);
		}
	});
};

/**
 * Delete an The clean crud
 */
exports.delete = function(req, res) {
	var theCleanCrud = req.theCleanCrud ;

	theCleanCrud.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(theCleanCrud);
		}
	});
};

/**
 * List of The clean cruds
 */
exports.list = function(req, res) { 
	TheCleanCrud.find().sort('-created').populate('user', 'displayName').exec(function(err, theCleanCruds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(theCleanCruds);
		}
	});
};

/**
 * The clean crud middleware
 */
exports.theCleanCrudByID = function(req, res, next, id) { 
	TheCleanCrud.findById(id).populate('user', 'displayName').exec(function(err, theCleanCrud) {
		if (err) return next(err);
		if (! theCleanCrud) return next(new Error('Failed to load The clean crud ' + id));
		req.theCleanCrud = theCleanCrud ;
		next();
	});
};

/**
 * The clean crud authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.theCleanCrud.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
