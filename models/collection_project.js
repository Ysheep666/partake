var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var CollectionProjectSchema = new mongoose.Schema({
  collection: {type: ObjectId, ref: 'Collection'}, // 集合
  project: {type: ObjectId, ref: 'Project'} // 项目
});

// 集合名称
CollectionProjectSchema.set('collection', 'collection_project');

// 序列化结果
CollectionProjectSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
CollectionProjectSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('CollectionProject', CollectionProjectSchema);
