/**
 * ShareDetail.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    account:{
      model: 'AccountsFB'
    },
    group:{
      model: 'Groups'
    },
    streamvideo:{
      model: 'StreamVideo'
    }
  }
};

