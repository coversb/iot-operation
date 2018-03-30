'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Server Configuration Schema
 */
var CfgCommandSchema = new Schema({
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
  mask: {
    type: String,
    default: '',
    trim: true,
    required: '事件报文开关不能为空'
  },
  infInterval: {
    type: String,
    default: '',
    trim: true,
    required: '信息报文上报间隔不能为空'
  }
});

mongoose.model('CfgCommand', CfgCommandSchema);
