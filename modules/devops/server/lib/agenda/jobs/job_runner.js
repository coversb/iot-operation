'use strict';

var Debug = require('debug');
var request = require('request');

function JobRunner(job) {
  this.job = job;
  this.logger = Debug('job:' + this.job.attrs._id);
}

JobRunner.prototype.run = function () {
  this.execute();
};

JobRunner.prototype.log = function () {
  var self = this;
  this.logger('running');
  this.logger("job-1 data:", this.job.attrs.data);
  this.timeout = setTimeout(function () {
    self.log();
  }, 1000);
};

JobRunner.prototype.destroy = function () {
  if (this.timeout) clearTimeout(this.timeout);
};

JobRunner.prototype.getBoxList = function (resCallback) {
  var param = {pageNum: 1, pageSize: 200};

  var options = {
    url: process.env.BACKBONE_URL + '/venueStatus',
    method: 'POST',
    body: param,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  var callback = function (err, res, body) {
    var ids = [];
    body.data.forEach(function (d) {
      ids.push(d.base.uniqueId);
    });
    return resCallback(ids);
  };

  request(options, callback);

};

JobRunner.prototype.execute = function () {
  console.log(process.env.BACKBONE_URL + '/gui/sendAirconConfigCommand');
  var $this = this;

  console.log("job attrs:", $this.job.attrs);
  this.getBoxList(sendAirCon);

  function sendAirCon(ids) {

    ids.forEach(function (id) {

      var param = {};
      param.uniqueId = id;
      param.messageType = 0x01;
      param.messageSubType = 0x06;
      param.airconCommandRequest = {
        'airConMode': parseInt(assembleMode($this.job.attrs.data.devAirConPwrMode
          , $this.job.attrs.data.devAirConWorkMode
          , $this.job.attrs.data.devAirConWindMode), 10),
        'airConInterval': parseInt('60', 10),
        'airConDuration': parseInt('60', 10),
        'airConTemperature': parseInt($this.job.attrs.data.devAirConTemperature , 10)
      };

      var options = {
        url: process.env.BACKBONE_URL + '/gui/sendAirconConfigCommand',
        method: 'POST',
        body: param,
        json: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      var callback = function (err, res, body) {
        console.log("setting condition:", param, body);
      };

      function assembleMode(pwrMode, workMode, wind) {
        var devAirConMode = '00'
          + assemblePadZero(Number(wind).toString(2), 2)
          + assemblePadZero(Number(workMode).toString(2), 2)
          + assemblePadZero(Number(pwrMode).toString(2), 2);

        return assemblePadZero(parseInt(devAirConMode, 2).toString(16), 2);
      }


      // fill '0' before string
      function assemblePadZero(str, n) {
        var temp = '00000000000000000000000000000000' + str;
        return temp.substr(temp.length - n);
      }

      request(options, callback);

    });

  }

};

module.exports = JobRunner;
