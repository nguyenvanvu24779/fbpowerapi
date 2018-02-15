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
    groupId: {
      type: 'string',
      unique: true
    },
    ShareDetail: {
      collection: 'ShareDetail',
      via: 'group'
    },
    hashtag : {
      collection: 'Hashtag',
      via: 'groups'
    }

  },
};

