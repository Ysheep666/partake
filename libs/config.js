// 配置
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var yaml = require('js-yaml');

var env = process.env.NODE_ENV || 'development';
var root = path.normalize(path.join(__dirname, '../'));
var configPath = path.join(root, 'config');

// 读取文件
var _read = function (file) {
  if (!fs.existsSync(file)) {
    return {};
  }
  return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
};

module.exports = function () {
  var defaultOptions = _read(configPath + '/default.yaml');
  var options =  _.merge(defaultOptions, _read(configPath + '/' + env +'.yaml'));

  options.setting.root = root;

  // 用于集成测试
  if (process.env.WERCKER_REDIS_URL) {
    options.db.redis = process.env.WERCKER_REDIS_URL;
  }

  if (process.env.WERCKER_MONGODB_URL) {
    options.db.mongodb = process.env.WERCKER_MONGODB_URL + '/partake';
  }

  global.adou = {};
  adou.config = options;
};
