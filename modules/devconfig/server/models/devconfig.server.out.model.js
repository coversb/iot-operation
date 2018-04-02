'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Output Operation Schema
 */
var OutCommandSchema = new Schema({
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
  pin: {
    type: String,
    default: '',
    trim: true,
    required: '输出引脚不能为空'
  },
  pinValue: {
    type: String,
    default: '',
    trim: true,
    required: '输出引脚状态不能为空'
  },
  pinMask: {
    type: String,
    default: '',
    trim: true,
    required: '输出状态不能为空'
  }
});

mongoose.model('OutCommand', OutCommandSchema);
