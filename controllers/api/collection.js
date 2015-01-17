// 集合 Api
var router = require('express').Router();

/**
 * @api {get} /api/collections 获取集合列表
 * @apiName collection list
 * @apiGroup Collection
 * @apiVersion 0.0.1
 *
 * @apiParam {Number} [page=1] 分页
 *
 * @apiSuccess {Object[]} collections 集合列表
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [{
 *      id: '5482f01e7961fec060a4b045',
 *      name: '前端框架',
 *      mark: 'front-frame',
 *      description: '收集常用的前端框架',
 *      background: 'https://unsplash.it/g/1600/300',
 *      cover: 'https://unsplash.it/g/300/300',
 *      systems: '跨平台',
 *      user: {
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      },
 *      vote_count: 68,
 *      fans_count: 5,
 *      create_at: new Date()
 *    }]
 */
// TODO: 接口实现

/**
 * @api {get} /api/collections/:id 获取集合详情
 * @apiName collection detail
 * @apiGroup Collection
 * @apiVersion 0.0.1
 *
 * @apiSuccess {Object} collection 集合详情
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      id: '5482f01e7961fec060a4b045',
 *      name: '前端框架',
 *      mark: 'front-frame',
 *      description: '收集常用的前端框架',
 *      background: 'https://unsplash.it/g/1600/300',
 *      cover: 'https://unsplash.it/g/300/300',
 *      systems: '跨平台',
 *      user: {
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      },
 *      vote_count: 68,
 *      fans_count: 5,
 *      create_at: new Date(),
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
 *        vote_count: 68,
 *        comment_count: 5,
 *        create_at: new Date()
 *      }],
 *      votes: [{
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      }],
 *      fanses: [{
 *        id: '5482f01e7961fec060a4babc',
 *        name: 'sadne',
 *        nickname: '不会飞的羊',
 *        description: '简洁是智慧的灵魂，冗长是肤浅的藻饰',
 *        avatar: 'https://avatars.githubusercontent.com/u/1539923?v=3'
 *      }]
 *    }
 */
// TODO: 接口实现

module.exports = router;
