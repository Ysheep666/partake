// 项目 Api
var router = require('express').Router();
var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var mongoose = require('mongoose');
var auth = require('../../libs/middlewares/auth');

/**
 * 生成时间的 ObjectId
 * @param  {number} timestamp 时间戳
 * @return {string} ObjectId 编码
 */
var _objectIdWithTimestamp = function (timestamp) {
  if (typeof timestamp === 'string') {
    timestamp = new Date(timestamp);
  }

  var hexSeconds = Math.floor(timestamp/1000).toString(16);
  var constructedObjectId = mongoose.Types.ObjectId(hexSeconds + '0000000000000000');
  return constructedObjectId;
};

/**
 * @api {get} /api/projects 获取项目列表
 * @apiName project list
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [index=0] 起始位置
 * @apiParam {Number} [count=3] 数量
 *
 * @apiSuccess {Object[]} projects 项目列表
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      date: new Date(),
 *      projects: [{
 *        id: '5482f01e7961fec060a4b045',
 *        name: 'angular',
 *        description: '一款优秀的前端JS框架，MVVM、模块化、自动化双向数据绑定、语义化标签、依赖注入',
 *        agreement: 'MIT',
 *        languages: 'JavaScript',
 *        systems: '跨平台',
 *        user: {
 *          id: '5482f01e7961fec060a4babc',
 *          name: 'sadne',
 *          nickname: '不会飞的羊',
 *          description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *          avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *        },
 *        vote: false,
 *        vote_count: 68,
 *        comment_count: 5,
 *        create_at: new Date()
 *      }]
 *    }]
 */
router.route('/').get(function (req, res, done) {
  if (req.query.admin) {
    return done();
  }

  var index = req.query.index ? parseInt(req.query.index, 10) : 0;
  var count = req.query.count ? parseInt(req.query.count, 10) : 3;

  var startTimestamp = moment().add(1 - index - count, 'days').format('YYYY/MM/DD');
  var endTimestamp = moment().add(1 - index, 'days').format('YYYY/MM/DD');

  var Project = mongoose.model('Project');
  var ProjectVote = mongoose.model('ProjectVote');
  var Follow = mongoose.model('Follow');

  async.waterfall([function (fn) {
    Project.find({_id: {$gt: _objectIdWithTimestamp(startTimestamp), $lt: _objectIdWithTimestamp(endTimestamp)}, is_delete: false})
      .select('name description languages vote_count comment_count user')
      .sort('-vote_count')
      .populate({path: 'user', select: 'name nickname description avatar'})
      .exec(function (err, projects) {
        fn(err, projects);
      });
  }, function (projects, fn) {
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

        fn(null, results);
      });
    } else {
      for (var i = 0; i < projects.length; i++) {
        var project = projects[i].toJSON();
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
    if (err) {
      return done(err);
    }

    var results = [];
    if (projects.length) {
      for (var i = count; i > 0; i--) {
        results.push({
          date: new Date(moment().add(i - index - count, 'days').format('YYYY/MM/DD')),
          projects: []
        });
      }

      for (var j = 0; j < projects.length; j++) {
        var project = projects[j];
        var dayDate = new Date(moment(project.created_at).format('YYYY/MM/DD'));
        for (var x = 0; x < results.length; x++) {
          var result = results[x];
          if (result.date.getTime() === dayDate.getTime()) {
            result.projects.push(project);
            break;
          }
        }
      }
    }

    res.status(200).json(results);
  });
});

/**
 * @api {get} /api/projects?admin=true 获取项目列表
 * @apiName project list admin
 * @apiPermission admin
 * @apiGroup Project
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
router.route('/').get(auth.checkUser).get(auth.checkAdministrate).get(function (req, res, done) {
  if (!req.query.admin) {
    return done();
  }

  var query = {is_delete: false};
  var index = req.query.index ? parseInt(req.query.index, 10) : 0;
  var count = req.query.count ? parseInt(req.query.count, 10) : 10;

  if (req.query.type && req.query.type === 'verify') {
    query.verify = true;
  }

  if (req.query.type && req.query.type === 'noverify') {
    query.verify = false;
  }

  var Project = mongoose.model('Project');

  async.waterfall([function (fn) {
    Project.count(query).exec(function (err, count) {
      fn(err, count);
    });
  }, function (_count, fn) {
    Project.find(query)
      .select('name url description agreement languages systems verify')
      .sort('-_id').skip(index).limit(count).exec(function (err, projects) {
        fn(err, _count, projects);
      });
  }], function (err, count, projects) {
    if (err) {
      return done(err);
    }

    res.status(200).set('item-count', count).json(projects);
  });
});

/**
 * @api {get} /api/projects/:id 获取项目详情
 * @apiName project detail
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiSuccess {Object} project 项目详情
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
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
 *      vote_count: 68,
 *      comment_count: 5,
 *      create_at: new Date(),
 *      votes: [{
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      }],
 *      comments: [{
 *        id: '5482f01e7961fec060a4babc',
 *        content: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        vote_count: 10,
 *        user: {
 *          id: '5482f01e7961fec060a4babc',
 *          name: 'sadne',
 *          nickname: '不会飞的羊',
 *          description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *          avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *        }
 *      }]
 *    }
 */
router.route('/:id').get(function (req, res, done) {
  var Comment = mongoose.model('Comment');
  var CommentVote = mongoose.model('CommentVote');
  var Project = mongoose.model('Project');
  var ProjectVote = mongoose.model('ProjectVote');
  var Follow = mongoose.model('Follow');

  async.waterfall([function (fn) {
    Project.findOne({_id: req.params.id, is_delete: false}).select('name description agreement languages systems vote_count comment_count user')
      .populate({path: 'user', select: 'name nickname description avatar'})
      .exec(function (err, project) {
        fn(err, project);
      });
  }, function (project, fn) {
    project = project.toJSON();
    if (req.user) {
      ProjectVote.count({project: project.id, user: req.user.id, is_delete: false}).exec(function (err, count) {
        if (err) {
          fn(err);
        }

        if (count) {
          project.vote = true;
        } else {
          project.vote = false;
        }

        fn(null, project);
      });
    } else {
      project.vote = false;
      fn(null, project);
    }
  }, function (project, fn) {
    if (req.user) {
      if (req.user.id === project.user.id) {
        project.user.is_me = true;
        fn(null, project);
      } else {
        Follow.count({fans: req.user.id, follower: project.user.id, is_delete: false}).exec(function (err, count) {
          if (err) {
            fn(err);
          }

          if (count) {
            project.user.follower = true;
          }
          fn(null, project);
        });
      }
    } else {
      fn(null, project);
    }
  }, function (project, fn) {
    ProjectVote.find({project: project.id, is_delete: false})
      .populate({path: 'user', select: 'name nickname description avatar'})
      .limit(38)
      .exec(function (err, votes) {
        if (err) {
          fn(err);
        }

        project.votes = [];
        for (var i = 0; i < votes.length; i++) {
          project.votes.push(votes[i].user.toJSON());
        }
        fn(null, project);
      });
  }, function (project, fn) {
    var results = [];
    if (req.user) {
      var ids = _.map(project.votes, function (vote) {
        return vote.id;
      });

      Follow.find({fans: req.user.id, follower: {$in: ids}, is_delete: false}).exec(function (err, follows) {
        if (err) {
          fn(err);
        }

        for (var i = 0; i < project.votes.length; i++) {
          var vote = project.votes[i];
          vote.follower = false;
          for (var j = 0; j < follows.length; j++) {
            if (follows[j].follower.equals(vote.id)) {
              vote.follower = true;
              break;
            }
          }

          if (req.user.id === vote.id) {
            vote.is_me = true;
          }
          results.push(vote);
        }

        project.votes = results;
        fn(null, project);
      });
    } else {
      fn(null, project);
    }
  }, function (project, fn) {
    Comment.find({project: project.id, is_delete: false})
      .select('content vote_count user')
      .sort('-vote_count')
      .populate({path: 'user', select: 'name nickname description avatar'})
      .limit(20)
      .exec(function (err, comments) {
        if (err) {
          fn(err);
        }
        project.comments = comments;
        fn(null, project);
      });
  }, function (project, fn) {
    var results = [];
    if (req.user) {
      var ids = _.map(project.comments, function (comment) {
        return comment.id;
      });

      CommentVote.find({comment: {$in: ids}, user: req.user.id, is_delete: false}).exec(function (err, votes) {
        if (err) {
          fn(err);
        }

        for (var i = 0; i < project.comments.length; i++) {
          var comment = project.comments[i].toJSON();
          comment.vote = false;
          for (var j = 0; j < votes.length; j++) {
            if (votes[j].comment.equals(comment.id)) {
              comment.vote = true;
              break;
            }
          }
          results.push(comment);
        }

        project.comments = results;
        fn(null, project);
      });
    } else {
      for (var i = 0; i < project.comments.length; i++) {
        var comment = project.comments[i].toJSON();
        comment.vote = false;
        results.push(comment);
      }

      project.comments = results;
      fn(null, project);
    }
  }, function (project, fn) {
    var results = [];
    if (req.user) {
      var ids = _.map(project.comments, function (comment) {
        return comment.user.id;
      });

      Follow.find({fans: req.user.id, follower: {$in: ids}, is_delete: false}).exec(function (err, follows) {
        if (err) {
          fn(err);
        }

        for (var i = 0; i < project.comments.length; i++) {
          var comment = project.comments[i];
          comment.user.follower = false;
          for (var j = 0; j < follows.length; j++) {
            if (follows[j].follower.equals(comment.user.id)) {
              comment.user.follower = true;
              break;
            }
          }

          if (req.user.id === comment.user.id) {
            comment.user.is_me = true;
          }
          results.push(comment);
        }

        project.comments = results;
        fn(null, project);
      });
    } else {
      fn(null, project);
    }
  }], function (err, project) {
    if (err) {
      return done(err);
    }

    res.status(200).json(project);
  });
});

/**
 * @api {post} /api/projects 提交项目
 * @apiName project create
 * @apiPermission provider
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {String} name 名称
 * @apiParam {String} url 链接地址
 * @apiParam {String} description 一句话描述
 *
 * @apiSuccess {String} id 项目ID
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045'
 *     }
 */
router.route('/').post(auth.checkUser).post(auth.checkProvider).post(function (req, res, done) {
  req.assert('name', '名称不能为空').notEmpty();
  req.assert('url', '链接地址不能为空').notEmpty();
  req.assert('url', '链接地址格式不正确').isURL();
  req.assert('description', '描述不能为空').notEmpty();

  var errs = req.validationErrors();

  if (errs) {
    return done({
      isValidation: true,
      errors: errs
    });
  }

  var Project = mongoose.model('Project');
  var User = mongoose.model('User');

  async.waterfall([function (fn) {
    var project = new Project({
      name: req.body.name.toLowerCase(),
      url: req.body.url,
      description: req.sanitize('description').escape(),
      user: req.user.id
    });
    fn(null, project);
  }, function (project, fn) {
    Project.count({name: project.name, is_delete: false}, function (err, count) {
      if (err) {
        return fn(err);
      }
      if (0 < count) {
        fn({isValidation: true, errors: [{
          param: 'name',
          msg: '该项目已经存在',
          value: project.name
        }]});
      } else {
        fn(null, project);
      }
    });
  }, function (project, fn) {
    project.save(function (err, project) {
      fn(err, project);
    });
  }, function (project, fn) {
    User.findByIdAndUpdate(project.user, {$inc: {'submit_count': 1}}, function (err) {
      fn(err, project);
    });
  }], function (err, project) {
    if (err) {
      return done(err);
    }

    res.status(201).json({id: project.id});
  });
});


/**
 * @api {put} /api/projects/:id?admin=true 更改项目信息
 * @apiName project update
 * @apiPermission admin
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {String} [name] 名称
 * @apiParam {String} [url] 链接地址
 * @apiParam {String} [description] 一句话描述
 * @apiParam {String} [agreement] 授权协议
 * @apiParam {String} [languages] 开发语言
 * @apiParam {String} [systems] 操作系统
 * @apiParam {Boolean} [verify] 是否通过审核
 *
 * @apiSuccess {String} id 项目ID
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

  req.assert('name', '名称不能为空').notEmpty();
  req.assert('url', '链接地址不能为空').notEmpty();
  req.assert('url', '链接地址格式不正确').isURL();
  req.assert('description', '描述不能为空').notEmpty();

  var errs = req.validationErrors();

  if (errs) {
    return done({
      isValidation: true,
      errors: errs
    });
  }

  var Project = mongoose.model('Project');

  async.waterfall([function (fn) {
    Project.findOne({_id: req.params.id, is_delete: false}, 'name', function (err, project) {
      if (project) {
        fn(null, project);
      } else {
        fn({isValidation: true, errors: [{
          param: 'id',
          msg: '该项目不存在',
          value: req.params.id
        }]});
      }
    });
  }, function (project, fn) {
    if (!project.verify) {
      project.online_at = new Date();
    }

    project.name = req.body.name.toLowerCase();
    project.url = req.body.url;
    project.description = req.sanitize('description').escape();
    project.agreement = req.body.agreement;
    project.languages = req.body.languages;
    project.systems = req.body.systems;
    project.verify = true;

    project.save(function (err, project) {
      fn(err, project);
    });
  }], function (err, project) {
    if (err) {
      return done(err);
    }

    res.status(201).json({id: project.id});
  });
});


/**
 * @api {get} /api/projects/:id/votes 获取项目投票人
 * @apiName project vote list
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [page=1] 分页
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
// TODO: 接口实现

/**
 * @api {post} /api/projects/:id/votes 项目投票
 * @apiName project vote update
 * @apiPermission user
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} id 项目ID
 * @apiSuccess {Boolean} vote 是否赞成
 * @apiSuccess {Number} vote_count 赞成数量
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045',
 *       vote: true,
 *       vote_count: 68
 *     }
 */
router.route('/:id/votes').post(auth.checkUser).post(function (req, res, done) {
  var Project = mongoose.model('Project');
  var ProjectVote = mongoose.model('ProjectVote');
  var User = mongoose.model('User');

  async.waterfall([function (fn) {
    var vote = new ProjectVote({
      project: req.params.id,
      user: req.user.id
    });
    fn(null, vote);
  }, function (vote, fn) {
    Project.count({_id: vote.project, is_delete: false}, function (err, count) {
      if (err) {
        return fn(err);
      }
      if (0 < count) {
        fn(null, vote);
      } else {
        fn({isValidation: true, errors: [{
          param: 'project',
          msg: '该项目不存在',
          value: vote.project
        }]});
      }
    });
  }, function (vote, fn) {
    ProjectVote.findOne({project: vote.project, user: vote.user}).exec(function (err, _vote) {
      if (err) {
        return fn(err);
      }
      var inc = 1;
      if (_vote) {
        if (!_vote.is_delete) {
          inc = -1;
        }
        vote = _vote;
        vote.is_delete = !_vote.is_delete;
      }

      fn(null, vote, inc);
    });
  }, function (vote, inc, fn) {
    vote.save(function (err, vote) {
      fn(err, vote, inc);
    });
  }, function (vote, inc, fn) {
    Project.findByIdAndUpdate(vote.project, {$inc: {'vote_count': inc}}, function (err, project) {
      fn(err, inc, vote, project);
    });
  }, function (inc, vote, project, fn) {
    User.findByIdAndUpdate(project.user, {$inc: {'vote_count': inc}}, function (err) {
      fn(err, vote, project);
    });
  }], function (err, vote, project) {
    if (err) {
      return done(err);
    }

    res.status(201).json({
      id: project.id,
      vote: !vote.is_delete,
      vote_count: project.vote_count
    });
  });
});


/**
 * @api {get} /api/projects/:id/comments 获取项目评论
 * @apiName project comment list
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [page=1] 分页
 *
 * @apiSuccess {Object[]} comments 评论列表
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      id: '5482f01e7961fec060a4babc',
 *      content: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *      vote_count: 10,
 *      user: {
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      }
 *    }]
 */
// TODO: 接口实现

module.exports = router;
