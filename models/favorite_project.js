var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var FavoriteProjectSchema = new mongoose.Schema({
  favorite: {type: ObjectId, ref: 'Favorite'}, // 集合
  project: {type: ObjectId, ref: 'Project'}, // 项目
  is_delete: {type: Boolean, default: false} // 是否已删除
});

// 集合名称
FavoriteProjectSchema.set('collection', 'favorite_project');

// 序列化结果
FavoriteProjectSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
FavoriteProjectSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('FavoriteProject', FavoriteProjectSchema);
