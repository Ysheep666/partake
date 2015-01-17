// 评论 Api
var router = require('express').Router();

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
 *       agree: true
 *     }
 */
// TODO: 接口实现


module.exports = router;