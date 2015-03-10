// 用户 Api
var router = require('express').Router();
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var auth = require('../../libs/middlewares/auth');

/**
 * @api {get} /api/users?admin=true 获取用户列表
 * @apiName user list admin
 * @apiPermission admin
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [index=0] 起始位置
 * @apiParam {Number} [count=20] 数量
 * @apiParam {String} [type=all] 类型
 *
 * @apiSuccess {Object[]} users 用户列表
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      id: '5482f01e7961fec060a4babc',
 *      name: 'sadne',
 *      nickname: '不会飞的羊',
 *      description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *      avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3',
 *      ...
 *    }]
 */
router.route('/').get(auth.checkUser).get(auth.checkAdministrate).get(function (req, res, done) {
  if (!req.query.admin) {
    return done();
  }

  var query = {is_delete: false};

  if (req.query.type && req.query.type === 'provider') {
    query.provider = true;
  }

  if (req.query.type && req.query.type === 'administrate') {
    query.administrate = true;
  }

  mongoose.model('User').find(query).exec(function (err, users) {
    if (err) {
      return done(err);
    }

    res.status(200).json(users);
  });
});

/**
 * @api {get} /api/users/@:name 获取用户详情
 * @apiName user detail
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiSuccess {Object} user 项目详情
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      id: '5482f01e7961fec060a4babc',
 *      name: 'sadne',
 *      nickname: '不会飞的羊',
 *      description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *      avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *    }
 */
router.route(/^\/\@(.+)$/).get(function (req, res, done) {
  var User = mongoose.model('User');

  async.waterfall([function (fn) {
    User.findOne({name: req.params[0], is_delete: false})
      .select('name nickname email description avatar vote_count submit_count favorite_count fans_count follower_count')
      .exec(function (err, user) {
        fn(err, user.toJSON());
      });
  }, function (user, fn) {
    if (req.user.id && req.user.id === user.id) {
      user.is_me = true;
    }
    fn(null, user);
  }], function (err, user) {
    if (err) {
      return done(err);
    }

    res.status(200).json(user);
  });
});

/**
 * @api {put} /api/users/:id 更改用户信息
 * @apiName user info update
 * @apiPermission user
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {String} [avatar] 头像地址
 * @apiParam {String} [nickname] 昵称
 * @apiParam {String} [description] 一句话描述
 *
 * @apiSuccess {String} id 用户ID
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045'
 *     }
 */
router.route('/:id').put(auth.checkUser).put(function (req, res, done) {
  if (req.query.admin) {
    return done();
  }

  if (req.user.id  !== req.params.id) {
    return done({isValidation: true, errors: [{
      param: 'id',
      msg: '只能更新自己的用户信息',
      value: req.params.id
    }]});
  }

  req.assert('avatar', '头像地址不能为空').notEmpty();
  req.assert('avatar', '头像地址格式不正确').isURL();

  var errs = req.validationErrors();

  if (errs) {
    return done({
      isValidation: true,
      errors: errs
    });
  }

  mongoose.model('User').findOneAndUpdate({_id: req.params.id, is_delete: false}, {$set: {
    avatar: req.body.avatar,
    nickname: req.sanitize('nickname').escape(),
    description: req.sanitize('description').escape()
  }}, function (err, user) {
    if (err) {
      return done(err);
    }
    res.status(200).json({id: user.id});
  });
});

/**
 * @api {put} /api/users/:id?admin=true 更改用户信息
 * @apiName user update
 * @apiPermission admin
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {Boolean} [provider] 是否是提供者
 * @apiParam {Boolean} [administrate] 是否是管理员
 *
 * @apiSuccess {String} id 用户ID
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045'
 *     }
 */
router.route('/:id').put(auth.checkUser).put(auth.checkAdministrate).put(function (req, res, done) {
  if (!req.query.admin) {
    return done();
  }

  var update = {};
  if (req.body.provider !== undefined) {
    update.provider = !!req.body.provider;
  }
  if (req.body.administrate !== undefined) {
    if (req.user.id  === req.params.id) {
      return done({isValidation: true, errors: [{
        param: 'id',
        msg: '不能取消自己的管理权限',
        value: req.params.id
      }]});
    }
    update.administrate = !!req.body.administrate;
  }

  mongoose.model('User').findOneAndUpdate({_id: req.params.id, is_delete: false}, {$set: update}, function (err, user) {
    if (err) {
      return done(err);
    }
    res.status(200).json({id: user.id});
  });
});

/**
 * @api {get} /api/users/:id/votes 获取投票项目列表
 * @apiName user votes list
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [index=0] 起始位置
 * @apiParam {Number} [count=10] 数量
 *
 * @apiSuccess {Object[]} projects 项目列表
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      id: '5482f01e7961fec060a4b045',
 *      name: 'angular',
 *      description: '一款优秀的前端JS框架，MVVM、模块化、自动化双向数据绑定、语义化标签、依赖注入',
 *      agreement: 'MIT',
 *      languages: 'JavaScript',
 *      systems: '跨平台',
 *      user: {
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      },
 *      vote: false,
 *      vote_count: 68,
 *      comment_count: 5,
 *      create_at: new Date()
 *    }]
 */
router.route('/:id/votes').get(function (req, res, done) {
  var index = req.query.index ? parseInt(req.query.index, 10) : 0;
  var count = req.query.count ? parseInt(req.query.count, 10) : 10;

  var Project = mongoose.model('Project');
  var ProjectVote = mongoose.model('ProjectVote');

  var query = {user: req.params.id, is_delete: false};
  async.waterfall([function (fn) {
    ProjectVote.count(query).exec(function (err, count) {
      fn(err, count);
    });
  }, function (_count, fn) {
    ProjectVote.find(query).select('project')
      .populate({path: 'project', select: 'id'})
      .sort('-project.vote_count')
      .skip(index).limit(count).exec(function (err, votes) {
        fn(err, _count, votes);
      });
  }, function (count, votes, fn) {
    var ids = _.map(votes, function (vote) {
      return vote.project.id;
    });

    Project.find({_id: {$in: ids}, is_delete: false})
      .select('name description languages vote_count comment_count user')
      .populate({path: 'user', select: 'name nickname description avatar'})
      .exec(function (err, projects) {
        fn(err, count, projects);
      });
  }, function (count, projects, fn) {
    var results = [];
    if (req.user) {
      var ids = _.map(projects, function (project) {
        return project.id;
      });

      ProjectVote.find({project: {$in: ids}, user: req.user.id, is_delete: false}).exec(function (err, votes) {
        if (err) {
          fn(err);
        }

        for (var i = 0; i < projects.length; i++) {
          var project = projects[i].toJSON();
          project.vote = false;
          for (var j = 0; j < votes.length; j++) {
            if (votes[j].project.equals(project.id)) {
              project.vote = true;
              break;
            }
          }
          results.push(project);
        }

        fn(null, count, results);
      });
    } else {
      for (var i = 0; i < projects.length; i++) {
        var project = projects[i].toJSON();
        project.vote = false;
        results.push(project);
      }

      fn(null, count, results);
    }
  }], function (err, count, projects) {
    if (err) {
      return done(err);
    }

    res.status(200).set('item-count', count).json(projects);
  });
});

/**
 * @api {get} /api/users/:id/submits 获取提交项目列表
 * @apiName user submits list
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [index=0] 起始位置
 * @apiParam {Number} [count=10] 数量
 *
 * @apiSuccess {Object[]} projects 项目列表
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      id: '5482f01e7961fec060a4b045',
 *      name: 'angular',
 *      description: '一款优秀的前端JS框架，MVVM、模块化、自动化双向数据绑定、语义化标签、依赖注入',
 *      agreement: 'MIT',
 *      languages: 'JavaScript',
 *      systems: '跨平台',
 *      user: {
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      },
 *      vote: false,
 *      vote_count: 68,
 *      comment_count: 5,
 *      create_at: new Date()
 *    }]
 */
router.route('/:id/submits').get(function (req, res, done) {
  var index = req.query.index ? parseInt(req.query.index, 10) : 0;
  var count = req.query.count ? parseInt(req.query.count, 10) : 10;

  var Project = mongoose.model('Project');
  var ProjectVote = mongoose.model('ProjectVote');

  var query = {user: req.params.id, is_delete: false};
  async.waterfall([function (fn) {
    Project.count(query).exec(function (err, count) {
      fn(err, count);
    });
  }, function (_count, fn) {
    Project.find(query)
      .select('name description languages vote_count comment_count user')
      .populate({path: 'user', select: 'name nickname description avatar'})
      .sort('-vote_count')
      .skip(index).limit(count).exec(function (err, projects) {
        fn(err, _count, projects);
      });
  }, function (count, projects, fn) {
    var results = [];
    if (req.user) {
      var ids = _.map(projects, function (project) {
        return project.id;
      });

      ProjectVote.find({project: {$in: ids}, user: req.user.id, is_delete: false}).exec(function (err, votes) {
        if (err) {
          fn(err);
        }

        for (var i = 0; i < projects.length; i++) {
          var project = projects[i].toJSON();
          project.vote = false;
          for (var j = 0; j < votes.length; j++) {
            if (votes[j].project.equals(project.id)) {
              project.vote = true;
              break;
            }
          }
          results.push(project);
        }

        fn(null, count, results);
      });
    } else {
      for (var i = 0; i < projects.length; i++) {
        var project = projects[i].toJSON();
        project.vote = false;
        results.push(project);
      }

      fn(null, count, results);
    }
  }], function (err, count, projects) {
    if (err) {
      return done(err);
    }

    res.status(200).set('item-count', count).json(projects);
  });
});

module.exports = router;
