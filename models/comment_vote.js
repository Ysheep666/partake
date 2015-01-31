var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var CommentVoteSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'}, // 用户
  comment: {type: ObjectId, ref: 'Comment'}, // 评论
  is_delete: {type: Boolean, default: false} // 是否已删除
});

// 集合名称
CommentVoteSchema.set('collection', 'comment_vote');

// 序列化结果
CommentVoteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
CommentVoteSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('CommentVote', CommentVoteSchema);
