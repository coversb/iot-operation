'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Time Adjust Schema
 */
var TmaCommandSchema = new Schema({
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
    required: '命令名称不能为空'
  },
  autoAdjust: {
    type: String,
    default: '',
    trim: true,
    required: '模式不能为空'
  },
  utc: {
    type: String,
    default: '',
    trim: true,
    required: 'UTC时间不能为空'
  }
});

mongoose.model('TmaCommand', TmaCommandSchema);
