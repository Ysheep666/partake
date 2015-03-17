// 默认 Api
var router = require('express').Router();
var crypto = require('crypto');
var async = require('async');
var mongoose = require('mongoose');

/**
 * @api {get} /api/search 搜索
 * @apiName search
 * @apiGroup Default
 * @apiVersion 0.0.1
 *
 * @apiParam {String} q 搜索文字
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       ...
 *     }
 *
 */
router.route('/search').get(function (req, res, done) {
  var query = req.query.q;

  var Project = mongoose.model('Project');
  var User = mongoose.model('User');

  async.parallel([function (fn) {
    Project.search({
      bool: {
        should: [{
          prefix: {name: query}
        }, {
          match: {description: query}
        }]
      }
    }, function (err, results) {
      fn(err, {projects: results.hits.hits});
    });
  }, function (fn) {
    User.search({
      bool: {
        should: [{
          prefix: {name: query}
        }, {
          prefix: {nickname: query}
        }, {
          prefix: {email: query}
        }]
      }
    }, function (err, results) {
      fn(err, {users: results.hits.hits});
    });
  }], function (err, results) {
    if (err) {
      return done(err);
    }

    res.send(results);
  });
});

/**
 * @api {post} /api/uptoken 获取又拍云 Token 信息
 * @apiName uptoken
 * @apiGroup Default
 * @apiVersion 0.0.1
 *
 * @apiParam {String} bucket UPYUN 空间名
 * @apiParam {String} expiration 过期时间
 * @apiParam {String} save-key 保存路径
 *
 * @apiSuccess {String} policy 上传 Policy
 * @apiSuccess {String} signature 上传 Signature
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "policy":"eyJidWNrZXQiOiJ0ZXN0LWtyIiwiZXhwaXJhdGlvbiI6MTQyMTQyNTIyNywic2F2ZS1rZXkiOiIve3llYXJ9e21vbn0ve2RheX0ve2ZpbGVtZDV9LXtyYW5kb219ey5zdWZmaXh9In0=",
 *       "signature":"621db6c45d1ed7ca7f068115a409ab6c"
 *     }
 */
router.route('/uptoken').post(function (req, res) {
  var bucket = ((function () {
    var results = [];
    var buckets = PT.config.upyun.buckets;
    for (var i = 0; i < buckets.length; i++) {
      var b = buckets[i];
      if (b.name === req.body.bucket.trim()) {
        results.push(b);
      }
    }
    return results;
  })())[0];

  req.body.expiration = parseInt((new Date().getTime() + 600000)/1000, 10);
  req.body['save-key'] = '/{year}{mon}/{day}/{filemd5}-{random}{.suffix}';

  var policy = new Buffer(JSON.stringify(req.body)).toString('base64');
  var signature = crypto.createHash('md5').update(policy + '&' + bucket.secret).digest('hex');
  return res.status(200).json({
    policy: policy,
    signature: signature
  });
});

/**
 * @api {delete} /api/logout 退出登录
 * @apiName logout
 * @apiGroup Default
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} message 成功提示消息
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 *     {
 *       "message": "退出登录成功"
 *     }
 */
router.route('/logout').delete(function (req, res) {
  req.logout();
  return res.status(202).json({
    message: '退出登录成功'
  });
});

module.exports = router;
