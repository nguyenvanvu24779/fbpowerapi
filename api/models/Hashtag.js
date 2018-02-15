/**
 * Hashtag.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    hashtag: {
      type: 'string',
      unique: true
    },
    groups : {
      collection: 'Groups',
      via: 'hashtag'
    }
  }
};

