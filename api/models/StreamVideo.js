/**
 * StreamVideo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    sharesAmount: {
      type: 'integer'
    },
    timeShareLimit : {
      type: 'integer'
    },
    credit : {
      type : 'integer',
      defaultsTo: function() {
        return this.timeShareLimit*this.sharesAmount*(this.timeShareLimit/30);
      }
    }

  }
};

