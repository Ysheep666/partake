// 默认 Api
var router = require('express').Router();

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
// TODO: 接口实现

module.exports = router;
