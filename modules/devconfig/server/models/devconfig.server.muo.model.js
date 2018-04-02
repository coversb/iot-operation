'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Multimedia Operation Schema
 */
var MuoCommandSchema = new Schema({
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
  type: {
    type: String,
    default: '',
    trim: true,
    required: '多媒体类型不能为空'
  },
  act: {
    type: String,
    default: '',
    trim: true,
    required: '动作类型不能为空'
  },
  vol: {
    type: String,
    default: '',
    trim: true,
    required: '音量不能为空'
  },
  mediaFname: {
    type: String,
    default: '',
    trim: true,
    required: '多媒体素材文件不能为空'
  }
});

mongoose.model('MuoCommand', MuoCommandSchema);
