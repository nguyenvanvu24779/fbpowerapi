/**
 * ContentShareController
 *
 * @description :: Server-side logic for managing Contentshares
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var pager = require('sails-pager');

module.exports = {
	addMulti : function(req, res) {
	    var contents = req.body.contents;
        var arrContent = contents.split("|");
        for (var i = 0; i < arrContent.length; i++) {
            var content = arrContent[i];
            ContentShare.create({content : content}).exec(function createCB(err1, created){
                if(err1){
                    console.log(err1)
                }
            });
            
        }
	    return res.json({message : 'ok'})
	},
	list: function(req, res) {
        var perPage = req.query.per_page;
        var currentPage = req.query.page;
        var conditions = {active: true};
 
        //Using Promises 
        pager.paginate(ContentShare, {}, currentPage, perPage, [], 'createdAt DESC').then(function(records){
            res.json(records);
        }).catch(function(err) {
            console.log(err);
        });
    },
};

