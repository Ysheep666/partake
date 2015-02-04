var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var FavoriteVoteSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'}, // 用户
  favorite: {type: ObjectId, ref: 'Favorite'}, // 集合
  is_delete: {type: Boolean, default: false} // 是否已删除
});

// 集合名称
FavoriteVoteSchema.set('collection', 'favorite_vote');

// 序列化结果
FavoriteVoteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
FavoriteVoteSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('FavoriteVote', FavoriteVoteSchema);
