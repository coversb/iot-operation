'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tv Volume Schema
 */
var TvVolumeSchema = new Schema({
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
  volume: {
    type: String,
    default: '',
    trim: true,
    required: '音量不能为空'
  }
});

mongoose.model('TvVolume', TvVolumeSchema);
