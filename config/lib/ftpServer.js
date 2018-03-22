var FtpSvr = require('ftp-srv');
var shell = require('shelljs');

var ftpServer = new FtpSvr('ftp://0.0.0.0:2121');

ftpServer.on('login', function (data, resolve, reject) {
  var connection = data.connection;
  var ftpPath = process.env.DATA_DIR || '/fota/bin';
  var username = data.username;
  var password = data.password;

  shell.mkdir('-p', ftpPath);

  if (username === 'fota' && password === 'fota') {
    resolve({root: ftpPath})
  } else {
    reject()
  }
});

ftpServer
  .listen()
  .then(function () {
    console.log('ready')
  });
