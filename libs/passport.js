// 用户认证
var async = require('async');
var mongoose = require('mongoose');

module.exports = function (passport) {
  var User = mongoose.model('User');
  var auth = PT.config.auth;

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, 'name nickname email avatar description provider administrate', done);
  });

  passport.use(new (require('passport-github').Strategy)({
    clientID: auth.github.client_id,
    clientSecret: auth.github.client_secret,
    callbackURL: auth.github.callback_url
  }, function (accessToken, refreshToken, profile, done) {
    var u = profile._json;
    async.waterfall([function (fn) {
      User.findOne({github: u.id}, function (err, user) {
        fn(err, user);
      });
    }, function (user, fn) {
      if (!user) {
        user = new User({
          github: u.id,
          name: u.login,
          nickname: u.name,
          email: u.email,
          avatar: u.avatar_url
        });
      } else {
        user.login_count++;
      }
      user.save(fn);
    }], function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  }));
};
