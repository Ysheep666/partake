var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var NotificationSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'}, // 用户
  content: {type: String, default: ''} // 内容
});

// 集合名称
NotificationSchema.set('collection', 'notification');

// 序列化结果
NotificationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
NotificationSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('Notification', NotificationSchema);
