// 默认 Api
var router = require('express').Router();
var crypto = require('crypto');
var _ = require('lodash');
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
  var ProjectVote = mongoose.model('ProjectVote');
  var User = mongoose.model('User');
  var Follow = mongoose.model('Follow');

  async.parallel([function (fn) {
    async.waterfall([function (fn) {
      Project.search({
        bool: {
          must_not: [{
            term: {is_delete: true}
          }],
          should: [{
            prefix: {name: query}
          }, {
            match: {description: query}
          }]
        }
      }, function (err, results) {
        if (err) {
          return fn(err);
        }

        var projects = [];
        for (var i = 0; i < results.hits.hits.length; i++) {
          var hit = results.hits.hits[i];

          delete hit._source._id;
          delete hit._source.verify;
          delete hit._source.is_delete;

          hit._source.id = hit._id;
          projects.push(hit._source);
        }

        fn(err, projects);
      });
    }, function (projects, fn) {
      var ids = _.map(projects, function (project) {
        return project.user;
      });

      User.find({_id: {$in: ids}, is_delete: false}).exec(function (err, users) {
        if (err) {
          return fn(err);
        }

        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          for (var j = 0; j < projects.length; j++) {
            if (user.id === projects[j].user) {
              projects[j].user = user.toJSON();
            }
          }
        }

        fn(null, projects);
      });
    }, function (projects, fn) {
      var results = [];
      if (req.user) {
        var ids = _.map(projects, function (project) {
          return project.id;
        });

        ProjectVote.find({project: {$in: ids}, user: req.user.id, is_delete: false}).exec(function (err, votes) {
          if (err) {
            return fn(err);
          }

          for (var i = 0; i < projects.length; i++) {
            var project = projects[i];
            project.vote = false;
            for (var j = 0; j < votes.length; j++) {
              if (votes[j].project.equals(project.id)) {
                project.vote = true;
                break;
              }
            }
            results.push(project);
          }

          fn(null, results);
        });
      } else {
        for (var i = 0; i < projects.length; i++) {
          var project = projects[i];
          project.vote = false;
          results.push(project);
        }

        fn(null, results);
      }
    }, function (projects, fn) {
      var results = [];
      if (req.user) {
        var ids = _.map(projects, function (project) {
          return project.user.id;
        });

        Follow.find({fans: req.user.id, follower: {$in: ids}, is_delete: false}).exec(function (err, follows) {
          if (err) {
            fn(err);
          }

          for (var i = 0; i < projects.length; i++) {
            var project = projects[i];
            project.user.follower = false;
            for (var j = 0; j < follows.length; j++) {
              if (follows[j].follower.equals(project.user.id)) {
                project.user.follower = true;
                break;
              }
            }

            if (req.user.id === project.user.id) {
              project.user.is_me = true;
            }
            results.push(project);
          }

          fn(null, results);
        });
      } else {
        for (var i = 0; i < projects.length; i++) {
          var project = projects[i];
          project.user.follower = false;
          results.push(project);
        }

        fn(null, results);
      }
    }], function (err, projects) {
      return fn(err, {projects: projects});
    });
  }, function (fn) {
    async.waterfall([function (fn) {
      User.search({
        bool: {
          must_not: [{
            term: {is_delete: true}
          }],
          should: [{
            prefix: {name: query}
          }, {
            prefix: {nickname: query}
          }, {
            prefix: {email: query}
          }]
        }
      }, function (err, results) {
        if (err) {
          return fn(err);
        }

        var users = [];
        for (var i = 0; i < results.hits.hits.length; i++) {
          var hit = results.hits.hits[i];

          delete hit._source._id;
          delete hit._source.provider;
          delete hit._source.administrate;
          delete hit._source.is_delete;

          hit._source.id = hit._id;
          users.push(hit._source);
        }

        fn(err, users);
      });
    }, function (users, fn) {
      var results = [];
      if (req.user) {
        var ids = _.map(users, function (user) {
          return user.id;
        });

        Follow.find({fans: req.user.id, follower: {$in: ids}, is_delete: false}).exec(function (err, follows) {
          if (err) {
            fn(err);
          }

          for (var i = 0; i < users.length; i++) {
            var user = users[i];
            user.follower = false;
            for (var j = 0; j < follows.length; j++) {
              if (follows[j].follower.equals(user.id)) {
                user.follower = true;
                break;
              }
            }

            if (req.user.id === user.id) {
              user.is_me = true;
            }
            results.push(user);
          }

          fn(null, results);
        });
      } else {
        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          user.follower = false;
          results.push(user);
        }

        fn(null, results);
      }
    }], function (err, users) {
      return fn(err, {users: users});
    });
  }], function (err, results) {
    if (err) {
      return done(err);
    }

    res.status(200).json(_.assign(results[0], results[1]));
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
