// 权限管理
module.exports = {
  /**
   * 检测是否是已登陆用户
   */
  checkUser: function (req, res, done) {
    if (!req.user) {
      if (req.xhr || req.isApi) {
        res.status(401).json({
          error: '未登录，没有此权限！'
        });
      } else {
        res.status(401).render('404', {
          code: 401,
          message: '未登录，没有此权限！'
        });
      }
    } else {
      return done();
    }
  },

  /**
   * 检测是否是项目提供者
   */
  checkProvider: function (req, res, done) {
    if (!req.user.provider) {
      if (req.xhr || req.isApi) {
        res.status(401).json({
          error: '未激活，没有此权限！'
        });
      } else {
        res.status(401).render('404', {
          code: 401,
          message: '未激活，没有此权限！'
        });
      }
    } else {
      return done();
    }
  },

  /**
   * 检测是否是管理员
   */
  checkAdministrate: function (req, res, done) {
    if (!req.user.administrate) {
      if (req.xhr || req.isApi) {
        res.status(401).json({
          error: '不是管理员，没有此权限！'
        });
      } else {
        res.status(401).render('404', {
          code: 401,
          message: '不是管理员，没有此权限！'
        });
      }
    } else {
      return done();
    }
  }
};
