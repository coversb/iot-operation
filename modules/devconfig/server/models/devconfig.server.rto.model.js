'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Real-time Operation Schema
 */
var RtoCommandSchema = new Schema({
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
  cmd: {
    type: String,
    default: '',
    trim: true,
    required: '命令不能为空'
  },
  subCmd: {
    type: String,
    default: '',
    trim: true,
    required: '子命令不能为空'
  }
});

mongoose.model('RtoCommand', RtoCommandSchema);
