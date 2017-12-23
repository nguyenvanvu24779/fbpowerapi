/**
 * AccountsFB.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  },
   // Lifecycle Callbacks
  beforeCreate: function (values, cb) {
    var username = values.username;
    AccountsFB.findOne({
      username: values.username
    }).exec(function (err, finn){
      if (err) {
        return cb(err);
      }
      if (!finn) {
        cb();
      } else cb("AccountsFB exists")
    });
  },
};

