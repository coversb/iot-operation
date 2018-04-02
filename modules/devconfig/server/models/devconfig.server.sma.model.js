'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Smoke Alarm Schema
 */
var SmaCommandSchema = new Schema({
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
  mode: {
    type: String,
    default: '',
    trim: true,
    required: '模式不能为空'
  },
  threshold: {
    type: String,
    default: '',
    trim: true,
    required: '触发阈值不能为空'
  },
  duration: {
    type: String,
    default: '',
    trim: true,
    required: '防误报时长不能为空'
  },
  interval: {
    type: String,
    default: '',
    trim: true,
    required: '上报间隔不能为空'
  }
});

mongoose.model('SmaCommand', SmaCommandSchema);
