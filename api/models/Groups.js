/**
 * Groups.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var FB = require('fb');
FB.options({version: 'v2.11'});

module.exports = {

  attributes: {

  },
  // Lifecycle Callbacks
  beforeCreate: function (values, cb) {
    var groupId = values.groupId;
    Groups.findOne({
      groupId: values.groupId
    }).exec(function (err, finn){
      if (err) {
        return cb(err);
      }
      if (!finn) {
        cb();
      } else cb("group exists")
    });
  },
};

