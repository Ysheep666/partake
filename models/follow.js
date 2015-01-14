var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var FollowSchema = new mongoose.Schema({
  followers: {type: ObjectId, ref: 'User'}, // 粉丝
  following: {type: ObjectId, ref: 'User'} // 关注
});

// 集合名称
FollowSchema.set('collection', 'follow');

// 序列化结果
FollowSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
FollowSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('Follow', FollowSchema);
