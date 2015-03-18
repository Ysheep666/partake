// 评论 Api
var router = require('express').Router();
var async = require('async');
var mongoose = require('mongoose');
var auth = require('../../libs/middlewares/auth');

/**
 * @api {get} /api/comments/:id/votes 获取评论投票人
 * @apiName comment vote list
 * @apiGroup Comment
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
 * @api {post} /api/comments 提交项目评论
 * @apiName project comment create
 * @apiPermission user
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {String} user 用户ID
 * @apiParam {String} project 项目ID
 * @apiParam {String} content 评论内容
 *
 * @apiSuccess {String} id 评论ID
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045'
 *     }
 */
router.route('/').post(auth.checkUser).post(function (req, res, done) {
  req.assert('user', '用户ID不能为空').notEmpty();
  req.assert('project', '项目ID不能为空').notEmpty();
  req.assert('content', '评论内容不能为空').notEmpty();

  var errs = req.validationErrors();

  if (errs) {
    return done({
      isValidation: true,
      errors: errs
    });
  }

  var Project = mongoose.model('Project');
  var Comment = mongoose.model('Comment');

  async.waterfall([function (fn) {
    var comment = new Comment({
      user: req.user.id,
      project: req.body.project,
      content: req.sanitize('content').escape()
    });

    if (req.body.parent) {
      comment.parent = req.body.parent;
    }

    fn(null, comment);
  }, function (comment, fn) {
    Project.count({_id: comment.project, is_delete: false}, function (err, count) {
      if (err) {
        return fn(err);
      }
      if (0 < count) {
        fn(null, comment);
      } else {
        fn({isValidation: true, errors: [{
          param: 'project',
          msg: '该项目不存在',
          value: comment.projec
        }]});
      }
    });
  }, function (comment, fn) {
    comment.save(function (err, comment) {
      fn(err, comment);
    });
  }, function (comment, fn) {
    Project.findByIdAndUpdate(comment.project, {$inc: {'comment_count': 1}}, function (err) {
      fn(err, comment);
    });
  }], function (err, comment) {
    if (err) {
      return done(err);
    }

    res.status(201).json({id: comment.id});
  });
});


/**
 * @api {post} /api/comments/:id/votes 评论投票
 * @apiName comment vote update
 * @apiPermission user
 * @apiGroup Comment
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} comment 评论ID
 * @apiSuccess {Boolean} agree 是否赞成
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
  var Comment = mongoose.model('Comment');
  var CommentVote = mongoose.model('CommentVote');

  async.waterfall([function (fn) {
    var vote = new CommentVote({
      comment: req.params.id,
      user: req.user.id
    });
    fn(null, vote);
  }, function (vote, fn) {
    Comment.count({_id: vote.comment, is_delete: false}, function (err, count) {
      if (err) {
        return fn(err);
      }
      if (0 < count) {
        fn(null, vote);
      } else {
        fn({isValidation: true, errors: [{
          param: 'comment',
          msg: '该评论不存在',
          value: vote.comment
        }]});
      }
    });
  }, function (vote, fn) {
    CommentVote.findOne({comment: vote.comment, user: vote.user}).exec(function (err, _vote) {
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
    Comment.findByIdAndUpdate(vote.comment, {$inc: {'vote_count': inc}}, function (err, comment) {
      fn(err, vote, comment);
    });
  }], function (err, vote, comment) {
    if (err) {
      return done(err);
    }

    res.status(201).json({
      id: comment.id,
      vote: !vote.is_delete,
      vote_count: comment.vote_count
    });
  });
});

/**
 * @api {delete} /api/comments/:id 删除评论
 * @apiName comment delete
 * @apiPermission user
 * @apiGroup Comment
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} id 评论ID
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045'
 *     }
 */
router.route('/:id').delete(auth.checkUser).delete(function (req, res, done) {
  var Project = mongoose.model('Project');
  var Comment = mongoose.model('Comment');

  async.waterfall([function (fn) {
    Comment.findOne({_id: req.params.id, is_delete: false}, function (err, comment) {
      if (err) {
        return fn(err);
      }

      if (!comment.user.equals(req.user.id)) {
        return done({isValidation: true, errors: [{
          param: 'id',
          msg: '只能删除自己的评论',
          value: req.params.id
        }]});
      }
      fn(null, comment);
    });
  }, function (comment, fn) {
    comment.is_delete = true;
    comment.save(function (err, comment) {
      fn(err, comment);
    });
  }, function (comment, fn) {
    Project.findByIdAndUpdate(comment.project, {$inc: {'comment_count': -1}}, function (err) {
      fn(err, comment);
    });
  }], function (err, comment) {
    if (err) {
      return done(err);
    }

    res.status(200).json({id: comment.id});
  });
});

module.exports = router;