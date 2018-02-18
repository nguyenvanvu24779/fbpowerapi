/**
 * OpenodeController
 *
 * @description :: Server-side logic for managing Openodes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Client = require('node-rest-client').Client;
var client = new Client();
var async = require("async");
var pager = require('sails-pager');

module.exports = {
	addOpenode : function(req, res){
	    var siteUrl = req.query.siteUrl;
	    
	    var accountsPerOpenode = 7;
	    async.waterfall([
	        function(callback){
	            Settings.findOne({
                    key : 'accountsPerOpenode'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        accountsPerOpenode = parseInt(finn.value);
                    }
                    callback();
                });
	        },
	        function(callback){
	            var rest = client.get("http://" + siteUrl + '/checkip', function (data, response) {
                    // parsed response body as js object 
                    var openode = {siteUrl : siteUrl, detail : data, ip : data.query, status : 'OK'};
                    AccountsFB.find({openode : null, status: { $in: [ "OK", "ADD_NEW" ] } }).limit(accountsPerOpenode).exec(function(err, accounts){
                       if(err){
                           console.log('[addOpenode] err:', err);
                           return res.json(500, { error: err })
                       }
                       if(accounts.length < accountsPerOpenode ){
                           sails.sockets.broadcast('root', {msg : 'accounts Fb not enough'});
                           return res.json(500, { error: 'accounts Fb not enough' })
                       }
                        Openode.create(openode).exec(function createCB(err1, create){
                            if(err1){
                                console.log(err1)
                                res.json(500, { error: err1 })
                                return sails.sockets.broadcast('root', {msg : 'error: openode exists'});
                            }
                            
                            for (var i = 0; i < accounts.length; i++) {
                                var account = accounts[i];
                                AccountsFB.update({ id : account.id },{ openode : create.id  }).exec(function afterwards(err, updated){})
                            }
                            sails.sockets.broadcast('root', {msg : 'add openode: ' +  openode.siteUrl  });
                            return res.json({ message : 'ok' });
                        });
                       
                    });
                   
                   
                });
                rest.on('error', function (err) {
                    console.log('request error', err);
                    res.json(500, { error: err })
                });
	        }
	    ], err => {
	       
	    })
	    
	},
	
	deleteOpenode : function(req, res){
	    var openodeID = req.query.openodeID;
	    Openode.find({id: openodeID }).populate('account').exec(function(e,rows){
	       if(rows.length <= 0 )
	        return res.json({ message : 'ok' });
	       //console.log('[deleteOpenode] account:', rows)
	       for (var i = 0; i <  rows[0].account.length; i++) {
	           rows[0].account.remove( rows[0].account[i].id);
	       }
	       rows[0].save(function(err){
	            Openode.destroy({id : openodeID}).exec(function(err1){
	                return res.json({ message : 'ok' });
	            });
	           
	       });
        });
       
	    
	},
	
	test : function(req, res ){
	    res.json({ugent :  sails.config.globals.userAgent});
	},
	
	 list: function(req, res) {
        var perPage = req.query.per_page;
        var currentPage = req.query.page;
        var conditions = {active: true};
 
        //Using Promises 
        pager.paginate(Openode, {}, currentPage, perPage, [], 'createdAt DESC').then(function(records){
            res.json(records);
        }).catch(function(err) {
            console.log(err);
        });
    },
};

