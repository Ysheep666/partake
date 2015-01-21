// 权限管理
module.exports = {
  /**
   * 检测是否是已登陆用户
   */
  checkUser: function (req, res, done) {
    if (!req.user) {
      return res.status(401).json({
        message: '未登录，没有此权限'
      });
    }
    return done();
  }
};