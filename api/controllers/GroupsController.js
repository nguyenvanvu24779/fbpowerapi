/**
 * GroupsController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require("async");
const https = require('https');
const decompress = require('iltorb').decompress;
var FB = require('fb');
var pager = require('sails-pager');
FB.options({version: 'v2.11'});

var requestWithEncoding = function(groupsId, user, callback) {
    
    var headers = {
      "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
      "accept-language" : "en-US,en;q=0.8",
      "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "user-agent" : "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
      "accept-encoding" : "gzip, deflate, br",
      "content-type" : "application/x-www-form-urlencoded",
      "cookie" :  user.cookie
    };

    var options = {
       // url: "https://www.facebook.com/groups/membership_criteria_answer/edit/?group_id=2026891637592451&source=gysj&dpr=1",
        headers: headers,
        hostname: 'www.facebook.com',
        path: "/groups/membership_criteria_answer/edit/?group_id=" + groupsId +  "&source=gysj&dpr=1",
        method: 'POST',
    };
  var request =  https.request(options,   (resp) => {
       var chunks = [];
        resp.on('data', function(chunk) {
          chunks.push(chunk);
        });
        resp.on('end', function() {
          var buffer = Buffer.concat(chunks);
          var encoding = resp.headers['content-encoding'];
            if( encoding == 'br'){  
                decompress(buffer, function(err, output) {
                  callback(err, output && output.toString());
                });
                
            } else {
                callback(null, buffer.toString());
          }
        });
    }).on("error", (err) => {
          console.log("Error: " + err.message);;
    });
  
   request.write("group_id=" + groupsId + 
       +"&source=gysj&__asyncDialog=2"
       +"&__user=" + user.__user 
       +"&__a=1"
       +"&__dyn=" + user.__dyn  
       +"&__req=4o&__be=1&__pc=PHASED%3ADEFAULT&__rev=3492490"
       +"&fb_dtsg=" + user.fb_dtsg
       +"&jazoest=" + user.jazoest
       +"&__spin_r=3492490&__spin_b=trunk&__spin_t=1512112658");
   request.end();
}

module.exports = {
    addMulti : function(req, res){
        var groupIds = req.query.groupIds;
        var arrGroupId = groupIds.split("|"); 
        var token = "";
        var user = {};
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
                Settings.findOne({
                    key : 'account_global'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        user = JSON.parse(finn.value);
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
                                    if(response.name) group.name = response.name;
                                    group.question = [];
                                    requestWithEncoding(group.groupId, user, function(err, data) {
                                        if (err)
                                            console.log(err);
                                        else{ 
                                            //console.log(data);
                                            if(data.includes("custom_questions")){
                                              data  = data.replace("for (;;);", "");
                                              var obj = JSON.parse(data);
                                              if(obj.jsmods.markup[1][1].__html.match(/<span><strong>(.*?)<\/strong><\/span>/g));
                                                group.question = obj.jsmods.markup[1][1].__html.match(/<span><strong>(.*?)<\/strong><\/span>/g);
                                            }
                                            Groups.create(group).exec(function createCB(err1, created){
                                                    if(err1){
                                                        console.log(err1)
                                                         sails.sockets.broadcast('root', {msg : 'error: group exists'});
                                                    }
                                                    else  sails.sockets.broadcast('root', {msg : 'add group: ' +  group.name  });
                                            });
                                            
                                        }
                                    })
                                } else{
                                    res.write(value + ", response.error\n" )
                                }
                                callback();
                               
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
        var user = {}
        var fetch = function (value, after ) { 
            var url = ""; 
            if(after != "")  
                url = "/" + value + "/sharedposts?fields=to{profile_type,name}&limit=1000" + "&after=" + after;
            else url =  "/" + value + "/sharedposts?fields=to{profile_type,name}&limit=1000";
            
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
                                    group.question = [];
      
                                       
                                    requestWithEncoding(group.groupId, user, function(err, data) {
                                        if (err)
                                            console.log(err);
                                        else{ 
                                            if(data.includes("custom_questions")){
                                              data  = data.replace("for (;;);", "");
                                              var obj = JSON.parse(data);
                                              if(obj.jsmods.markup[1][1].__html.match(/<span><strong>(.*?)<\/strong><\/span>/g));
                                                group.question = obj.jsmods.markup[1][1].__html.match(/<span><strong>(.*?)<\/strong><\/span>/g);
                                            }
                                            Groups.create(group).exec(function createCB(err1, created){
                                                    if(err1)
                                                        console.log(err1)
                                                    else  sails.sockets.broadcast('root', {msg : 'add group: ' + item.to.data[0].name  });
                                            });
                                            
                                        }
                                    })
                                    
                                   
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
                Settings.findOne({
                    key : 'account_global'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        user = JSON.parse(finn.value);
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
    
    list: function(req, res) {
        var perPage = req.query.per_page;
        var currentPage = req.query.page;
        var conditions = {active: true};
 
        //Using Promises 
        pager.paginate(Groups, {}, currentPage, perPage, [], 'createdAt DESC').then(function(records){
            res.json(records);
        }).catch(function(err) {
            console.log(err);
        });
    },
};

