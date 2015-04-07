'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * The clean crud Schema
 */
var TheCleanCrudSchema = new Schema({
	name: {
		type: String,
		default: 'tc crud',
		trim: true
	},
    orderDate:{
        type: Date
    },
    deliberyDate:{
        type: Date
    },
		numOrder:{
			type: Number
		},
    Address:{
        type: String
    },
    detailInfo:{
        type: String
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

mongoose.model('TheCleanCrud', TheCleanCrudSchema);
