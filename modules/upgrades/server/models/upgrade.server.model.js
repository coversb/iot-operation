'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Upgrade Schema
 */
var UpgradeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Upgrade name',
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

mongoose.model('Upgrade', UpgradeSchema);
