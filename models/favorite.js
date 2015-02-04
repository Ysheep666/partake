var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var FavoriteSchema = new mongoose.Schema({
  name: {type: String, default: ''}, // 名称
  mark: {type: String, index: true}, // 标示
  description: {type: String, default: ''}, // 一句话描述
  background: {type: String, default: ''}, // 背景
  cover: {type: String, default: ''}, // 封面
  user: {type: ObjectId, ref: 'User'}, // 拥有者
  vote_count: {type: Number, default: 0}, // 投票统计
  fans_count: {type: Number, default: 0}, // 粉丝统计
  is_delete: {type: Boolean, default: false} // 是否已删除
});

// 集合名称
FavoriteSchema.set('collection', 'favorite');

// 序列化结果
FavoriteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
FavoriteSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('Favorite', FavoriteSchema);
