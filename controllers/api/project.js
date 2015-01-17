// 项目 Api
var router = require('express').Router();

/**
 * @api {get} /api/projects 获取项目列表
 * @apiName project list
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [page=1] 分页
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
 *      vote_count: 68,
 *      comment_count: 5,
 *      create_at: new Date()
 *    }]
 */
router.route('/').get(function (req, res) {
  setTimeout(function () {
    res.json([{
      id: '5482f01e7961fec060a4b045',
      name: 'angular',
      description: '一款优秀的前端JS框架，MVVM、模块化、自动化双向数据绑定、语义化标签、依赖注入',
      agreement: 'MIT',
      languages: 'JavaScript',
      systems: '跨平台',
      user: {
        id: '5482f01e7961fec060a4babc',
        name: 'sadne',
        nickname: '不会飞的羊',
        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
      },
      vote_count: 68,
      comment_count: 5,
      create_at: new Date()
    }, {
      id: '54844f59af514ae108eeeaaa',
      name: 'jquery',
      description: '一个优秀的轻量级Javascript库，它兼容CSS3，还兼容各种浏览器',
      agreement: 'MIT',
      languages: 'JavaScript',
      systems: '跨平台',
      user: {
        id: '5482f01e7961fec060a4babc',
        name: 'sadne',
        nickname: '不会飞的羊',
        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
      },
      vote_count: 897,
      comment_count: 5,
      create_at: new Date()
    }]);
  }, 1000);
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
router.route('/:id').get(function (req, res) {
  setTimeout(function () {
    res.json({
      id: '5482f01e7961fec060a4b045',
      name: 'angular',
      description: '一款优秀的前端JS框架，MVVM、模块化、自动化双向数据绑定、语义化标签、依赖注入',
      agreement: 'MIT',
      languages: 'JavaScript',
      systems: '跨平台',
      user: {
        id: '5482f01e7961fec060a4babc',
        name: 'sadne',
        nickname: '不会飞的羊',
        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
      },
      vote_count: 68,
      comment_count: 5,
      create_at: new Date()
    });
  }, 1000);
});

/**
 * @api {post} /api/projects 提交项目
 * @apiName project create
 * @apiPermission user
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
// TODO: 接口实现
router.route('/:id').post(function (req, res) {
  setTimeout(function () {
    res.json({
      id: '5482f01e7961fec060a4b045',
    });
  }, 1000);
});


/**
 * @api {put} /api/projects/:id 更改项目信息
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
 * @apiParam {String} [verify] 是否通过审核
 *
 * @apiSuccess {String} id 项目ID
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045'
 *     }
 */
// TODO: 接口实现

/**
 * @api {post} /api/projects/:id/unique 唯一性验证
 * @apiName project unique
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {String} [name] 名称
 * @apiParam {String} [url] 链接地址
 *
 * @apiSuccess {String} id 项目ID
 * @apiSuccess {Boolean} unique 是否唯一
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      id: '5482f01e7961fec060a4babc',
 *      unique: true
 *    }
 */
// TODO: 接口实现

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
 * @apiSuccess {String} project 项目ID
 * @apiSuccess {Boolean} agree 是否赞成
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       id: '5482f01e7961fec060a4b045',
 *       agree: true
 *     }
 */
// TODO: 接口实现

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

/**
 * @api {post} /api/projects/:id/comments 提交项目评论
 * @apiName project comment create
 * @apiPermission user
 * @apiGroup Project
 * @apiVersion 0.0.1
 *
 * @apiParam {String} project 项目ID
 * @apiParam {String} [comment] 评论ID
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
// TODO: 接口实现

module.exports = router;
