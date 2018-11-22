'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tv Config Schema
 */
var TvConfigSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: '配置名称不能为空'
  },
  rebootSwitch: {
    type: String,
    default: '',
    trim: true,
    required: '重启开关不能为空'
  }
});

mongoose.model('TvConfig', TvConfigSchema);
