// 用户 Api
var router = require('express').Router();
var mongoose = require('mongoose');
var auth = require('../../libs/middlewares/auth');

/**
 * @api {get} /api/users?admin=true 获取用户列表
 * @apiName user list
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
 * @api {put} /api/users/:id?admin=true 更改用户信息
 * @apiName user update
 * @apiPermission admin
 * @apiGroup User
 * @apiVersion 0.0.1
 *
 * @apiParam {Boolean} [provider] 名称
 * @apiParam {Boolean} [administrate] 链接地址
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
