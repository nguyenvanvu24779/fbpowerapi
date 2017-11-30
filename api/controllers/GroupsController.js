/**
 * GroupsController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require("async");
var FB = require('fb');
FB.options({version: 'v2.11'});
module.exports = {
    addMulti : function(req, res){
        var groupIds = req.query.groupIds;
        var arrGroupId = groupIds.split("|"); 
        var token = "";
         async.waterfall([
            function(cb){
                Settings.findOne({
                    key : 'access_token'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        token = finn.value;
                    }
                    cb()
                });
            },
            function(cb){
                FB.setAccessToken(token);
                async.forEachOf(arrGroupId, (value, key, callback) => {
                        FB.api(
                            "/" + value, 
                            function (response) {
                                //console.log(response);
                                var group = {};
                                if(response &&  !response.error) {
                                    if(response.name)
                                        group.name =  response.name;
                                    else {
                                        FB.api("/" + response.id , function(response1){
                                            response = response1;
                                        })
                                    }
                                }
                                if (response && !response.error) {
                                    if(response.privacy) group.privacy =  response.privacy;
                                    if(response.id) group.groupId =  response.id;
                                    Groups.create(group).exec(function createCB(err1, created){
                                        if(err1)
                                            res.write(value + ", err: "  + err1);
                                        else res.write(value  + ", created: " + JSON.stringify(created) + "\n");
                                        callback();
                                    });
                                } else{
                                    res.write(value + ", response.error\n" );
                                    callback();
                                }
                               
                            }
                        )
                }, err => {
                    if (err) console.error(err.message);
                    res.end();
                });
                cb()
            }
        ],function(error,success ){
            
        }); 
        
        
    },
    
    addGroupsByVideoId : function (req, res){
        var videoIds = req.query.videoIds;
        var arrVideoIds = videoIds.split("|");
         sails.sockets.broadcast('root', {msg : 'test group'  });
        var fetch = function (value, after ) { 
            var url = ""; 
            if(after != "")  
                url = "/" + value + "/sharedposts?fields=to{profile_type,name}&limit=2000" + "&after=" + after;
            else url =  "/" + value + "/sharedposts?fields=to{profile_type,name}&limit=2000";
            
            console.log(url);
            
            FB.api(url, function(response){
              
                if(response && ! response.error){
                    var data = response.data;
                    async.forEachOf(data, (item, key, callback) => {
                        if(item.to && item.to.data[0].profile_type == "group"){
                            // res.write(JSON.stringify( data[i].to));
                             //sails.sockets.broadcast('root', {msg : 'add group: ' + item.to.data[0].name  });
                             FB.api("/" + item.to.data[0].id , function(response) {
                                if (response && !response.error) {
                                    var group = {};
                                    if(response.name) group.name = response.name;
                                    if(response.privacy) group.privacy =  response.privacy;
                                    if(response.id) group.groupId =  response.id;
                                    Groups.create(group).exec(function createCB(err1, created){
                                        if(err1)
                                            console.log(err1)
                                        else  sails.sockets.broadcast('root', {msg : 'add group: ' + item.to.data[0].name  });
                                    });
                                }
                             });
                             console.log(JSON.stringify(item.to));
                        }
                        callback();
                    }, err => {})
                  
                    if(response.paging && response.paging.next) 
                        fetch(value, response.paging.cursors.after);
                    } else {
                        sails.sockets.broadcast('root', {msg : 'error: ' + JSON.stringify(response.error) });
                        console.log(response.error);
                    }
            });
        }
        
        var token = '';
        
        async.waterfall([
            function(cb){
                Settings.findOne({
                    key : 'access_token'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        token = finn.value;
                    }
                    cb()
                });
            },
            function(cb){
                FB.setAccessToken(token); 
                async.forEachOf(arrVideoIds, (value, key, callback) => {
                    fetch(value, "");
                    callback();
                }, err => {
                    res.json({message : 'ok'});
                });
                cb();
             },
             
        ], function (error, success) {
          
        });
    },
};

