// 数据库
var fs = require('fs');
var mongoose = require('mongoose');

module.exports = function () {
  var config = PT.config;
  mongoose.connect(config.db.mongodb);
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db.mongodb);
  });

  fs.readdirSync(config.setting.root + '/models').forEach(function (file) {
    if (file.indexOf('.js') > 0) {
      require(config.setting.root + '/models/' + file);
    }
  });
};
