var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var CommentSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'}, // 用户
  project: {type: ObjectId, ref: 'Project'}, // 项目
  content: {type: String, default: ''}, // 评论内容
  vote_count: {type: Number, default: 0}, // 投票统计
  is_delete: {type: Boolean, default: false} // 是否已删除
});

// 集合名称
CommentSchema.set('collection', 'comment');

// 序列化结果
CommentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
CommentSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('Comment', CommentSchema);
