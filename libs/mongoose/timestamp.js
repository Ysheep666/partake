/**
 * Timestamps 用于自动产生数据的创建时间和更新时间
 *
 * 使用方法：
 *
 *   schema.plugin(require('./timestamp'));
 *
 */
module.exports = function (schema) {
  if (schema.path('_id')) {
    schema.add({
      updated_at: Date
    });

    schema.virtual('created_at').get(function () {
      if (this._created_at) {
        return this._created_at;
      }

      this._created_at = this._id.getTimestamp();
      return this._created_at;
    });

    schema.pre('save', function (done) {
      if (this.isNew) {
        this.updated_at = this.created_at;
      } else {
        this.updated_at = new Date();
      }
      done();
    });
  } else {
    schema.add({
      created_at: Date,
      updated_at: Date
    });

    schema.pre('save', function (done) {
      if (!this.created_at) {
        this.created_at = this.updated_at = new Date();
      } else {
        this.updated_at = new Date();
      }
      done();
    });
  }
};
