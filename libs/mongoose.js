// 数据库
var mongoose = require('mongoose');

module.exports = function () {
  var url = adou.config.db.mongodb.url;
  mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + url);
  });
};
