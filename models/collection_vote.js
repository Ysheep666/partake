var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var CollectionVoteSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'}, // 用户
  collection: {type: ObjectId, ref: 'Collection'} // 集合
});

// 集合名称
CollectionVoteSchema.set('collection', 'collection_vote');

// 序列化结果
CollectionVoteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
CollectionVoteSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('CollectionVote', CollectionVoteSchema);
