// 系统
var passport = require('passport');
var app = require('express')();

require('./libs/config')();
require('./libs/mongoose')();
require('./libs/passport')(passport);
require('./libs/express')(app, passport);
require('./libs/router')(app);

module.exports = app;

