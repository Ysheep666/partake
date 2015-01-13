// 项目 Api
var router = require('express').Router();

router.route('/').get(function (req, res) {
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
});

router.route('/:id').get(function (req, res) {
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
});

module.exports = router;
