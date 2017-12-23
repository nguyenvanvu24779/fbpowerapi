/**
 * AccountsFBController
 *
 * @description :: Server-side logic for managing Accountsfbs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var pager = require('sails-pager');

module.exports = {
	list: function(req, res) {
        var perPage = req.query.per_page;
        var currentPage = req.query.page;
        var conditions = {active: true};
        //Using Promises 
        pager.paginate(AccountsFB, {}, currentPage, perPage, [], 'createdAt DESC').then(function(records){
            res.json(records);
        }).catch(function(err) {
            console.log(err);
        });
    },
};

