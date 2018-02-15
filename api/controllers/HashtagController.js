/**
 * HashtagController
 *
 * @description :: Server-side logic for managing Hashtags
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var pager = require('sails-pager');
module.exports = {
	list: function(req, res) {
        var perPage = req.query.per_page;
        var currentPage = req.query.page;
        var sortBy = req.query.sortBy;
        if(sortBy == null || sortBy == undefined){
            sortBy = 'createdAt';
        }
        var conditions = {active: true};
 
        //Using Promises 
        pager.paginate(Hashtag, {}, currentPage, perPage, [], sortBy + ' DESC').then(function(records){
            res.json(records);
        }).catch(function(err) {
            console.log(err);
        });
    },
};

