var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var ProjectVoteSchema = new mongoose.Schema({
  project: {type: ObjectId, ref: 'Project'}, // 项目
  user: {type: ObjectId, ref: 'User'}, // 用户
  is_delete: {type: Boolean, default: false} // 是否已删除
});

// 集合名称
ProjectVoteSchema.set('collection', 'project_vote');

// 序列化结果
ProjectVoteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
ProjectVoteSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('ProjectVote', ProjectVoteSchema);
