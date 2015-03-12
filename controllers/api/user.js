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
  var Follow = mongoose.model('Follow');

  async.waterfall([function (fn) {
    User.findOne({name: req.params[0], is_delete: false})
      .select('name nickname email description avatar vote_count submit_count favorite_count fans_count follower_count')
      .exec(function (err, user) {
        fn(err, user);
      });
  }, function (user, fn) {
    user = user.toJSON();
    if (req.user) {
      if (req.user.id === user.id) {
        user.is_me = true;
        fn(null, user);
      } else {
        Follow.count({fans: req.user.id, follower: user.id, is_delete: false}).exec(function (err, count) {
          if (err) {
            fn(err);
          }

          if (count) {
            user.follower = true;
          }
          fn(null, user);
        });
      }
    } else {
      fn(null, user);
    }
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
  var Follow = mongoose.model('Follow');

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
  }, function (count, projects, fn) {
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

        fn(null, count, results);
      });
    } else {
      for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        project.user.follower = false;
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
  var Follow = mongoose.model('Follow');

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
  }, function (count, projects, fn) {
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

        fn(null, count, results);
      });
    } else {
      for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        project.user.follower = false;
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
 * @api {get} /api/users/:id/fans 获取粉丝列表
 * @apiName user fans list
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [index=0] 起始位置
 * @apiParam {Number} [count=10] 数量
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
 *      avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *    }]
 */
router.route('/:id/fans').get(function (req, res, done) {
  var index = req.query.index ? parseInt(req.query.index, 10) : 0;
  var count = req.query.count ? parseInt(req.query.count, 10) : 10;

  var Follow = mongoose.model('Follow');

  var query = {follower: req.params.id, is_delete: false};
  async.waterfall([function (fn) {
    Follow.count(query).exec(function (err, count) {
      fn(err, count);
    });
  }, function (_count, fn) {
    Follow.find(query)
      .select('fans')
      .populate({path: 'fans', select: 'name nickname description avatar'})
      .sort('-fans_count')
      .skip(index).limit(count).exec(function (err, follows) {
        fn(err, _count, follows);
      });
  }, function (count, follows, fn) {
    var results = [];
    if (req.user) {
      var ids = _.map(follows, function (follow) {
        return follow.fans.id;
      });

      Follow.find({fans: req.user.id, follower: {$in: ids}, is_delete: false}).exec(function (err, _follows) {
        if (err) {
          fn(err);
        }

        for (var i = 0; i < follows.length; i++) {
          var follow = follows[i].toJSON();
          follow.fans.follower = false;
          for (var j = 0; j < _follows.length; j++) {
            if (_follows[j].follower.equals(follow.fans.id)) {
              follow.fans.follower = true;
              break;
            }
          }

          if (req.user.id === follow.fans.id) {
            follow.fans.is_me = true;
          }
          results.push(follow.fans);
        }

        fn(null, count, results);
      });
    } else {
      for (var i = 0; i < follows.length; i++) {
        var follow = follows[i].toJSON();
        follow.fans.follower = false;
        results.push(follow.fans);
      }

      fn(null, count, results);
    }
  }], function (err, count, users) {
    if (err) {
      return done(err);
    }

    res.status(200).set('item-count', count).json(users);
  });
});


/**
 * @api {post} /api/users/:id/fans 关注用户
 * @apiName users fans create
 * @apiPermission user
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} id 用户ID
 * @apiSuccess {Boolean} follower 是否关注
 * @apiSuccess {Number} fans_count 粉丝数量
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045',
 *       follower: true,
 *       fans_count: 68
 *     }
 */
router.route('/:id/fans').post(auth.checkUser).post(function (req, res, done) {
  if (req.user.id === req.params.id) {
    return done({isValidation: true, errors: [{
      param: 'user',
      msg: '不能关注自己',
      value: req.params.id
    }]});
  }

  var User = mongoose.model('User');
  var Follow = mongoose.model('Follow');

  async.waterfall([function (fn) {
    var follow = new Follow({
      fans: req.user.id,
      follower: req.params.id
    });
    fn(null, follow);
  }, function (follow, fn) {
    User.count({_id: follow.follower, is_delete: false}, function (err, count) {
      if (err) {
        return fn(err);
      }
      if (0 < count) {
        fn(null, follow);
      } else {
        fn({isValidation: true, errors: [{
          param: 'user',
          msg: '该用户不存在',
          value: follow.follower
        }]});
      }
    });
  }, function (follow, fn) {
    Follow.findOne({fans: follow.fans, follower: follow.follower}).exec(function (err, _follow) {
      if (err) {
        return fn(err);
      }
      var inc = 1;
      if (_follow) {
        if (!_follow.is_delete) {
          inc = -1;
        }
        follow = _follow;
        follow.is_delete = !_follow.is_delete;
      }

      fn(null, follow, inc);
    });
  }, function (follow, inc, fn) {
    follow.save(function (err, follow) {
      fn(err, follow, inc);
    });
  }, function (follow, inc, fn) {
    User.findByIdAndUpdate(follow.follower, {$inc: {'fans_count': inc}}, function (err, user) {
      fn(err, inc, follow, user);
    });
  }, function (inc, follow, user, fn) {
    User.findByIdAndUpdate(follow.fans, {$inc: {'follower_count': inc}}, function (err) {
      fn(err, follow, user);
    });
  }], function (err, follow, user) {
    if (err) {
      return done(err);
    }

    res.status(201).json({
      id: user.id,
      follower: !follow.is_delete,
      fans_count: user.fans_count
    });
  });
});


/**
 * @api {get} /api/users/:id/follows 获取粉丝列表
 * @apiName user follower list
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [index=0] 起始位置
 * @apiParam {Number} [count=10] 数量
 *
 * @apiSuccess {Object[]} users 列表
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      id: '5482f01e7961fec060a4babc',
 *      name: 'sadne',
 *      nickname: '不会飞的羊',
 *      description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *      avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *    }]
 */
router.route('/:id/follows').get(function (req, res, done) {
  var index = req.query.index ? parseInt(req.query.index, 10) : 0;
  var count = req.query.count ? parseInt(req.query.count, 10) : 10;

  var Follow = mongoose.model('Follow');

  var query = {fans: req.params.id, is_delete: false};
  async.waterfall([function (fn) {
    Follow.count(query).exec(function (err, count) {
      fn(err, count);
    });
  }, function (_count, fn) {
    Follow.find(query)
      .select('follower')
      .populate({path: 'follower', select: 'name nickname description avatar'})
      .sort('-fans_count')
      .skip(index).limit(count).exec(function (err, follows) {
        fn(err, _count, follows);
      });
  }, function (count, follows, fn) {
    var results = [];
    if (req.user) {
      var ids = _.map(follows, function (follow) {
        return follow.follower.id;
      });

      Follow.find({fans: req.user.id, follower: {$in: ids}, is_delete: false}).exec(function (err, _follows) {
        if (err) {
          fn(err);
        }

        for (var i = 0; i < follows.length; i++) {
          var follow = follows[i].toJSON();
          follow.follower.follower = false;
          for (var j = 0; j < _follows.length; j++) {
            if (_follows[j].follower.equals(follow.follower.id)) {
              follow.follower.follower = true;
              break;
            }
          }

          if (req.user.id === follow.follower.id) {
            follow.follower.is_me = true;
          }
          results.push(follow.follower);
        }

        fn(null, count, results);
      });
    } else {
      for (var i = 0; i < follows.length; i++) {
        var follow = follows[i].toJSON();
        follow.follower.follower = false;
        results.push(follow.follower);
      }

      fn(null, count, results);
    }
  }], function (err, count, users) {
    if (err) {
      return done(err);
    }

    res.status(200).set('item-count', count).json(users);
  });
});

module.exports = router;
