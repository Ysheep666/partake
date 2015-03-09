// 用户 Api
var router = require('express').Router();
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

module.exports = router;
