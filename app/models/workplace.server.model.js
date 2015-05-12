'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workplace Schema
 */
var WorkplaceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Workplace name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Workplace', WorkplaceSchema);