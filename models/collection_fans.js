var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var CollectionFansSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'}, // 用户
  collection: {type: ObjectId, ref: 'Collection'} // 集合
});

// 集合名称
CollectionFansSchema.set('collection', 'collection_fans');

// 序列化结果
CollectionFansSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
CollectionFansSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('CollectionFollowers', CollectionFansSchema);
