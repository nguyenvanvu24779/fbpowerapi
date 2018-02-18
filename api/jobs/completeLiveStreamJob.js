var async = require("async");
var FB = require('fb');
FB.options({version: 'v2.11'});
const decompress = require('iltorb').decompress;
const https = require('https');

var fetch = function (value,shareDetails ,after ) { 
            var url = ""; 
            if(after != "")  
                url = "/" + value + "/sharedposts?fields=to{profile_type,name},from&limit=1000" + "&after=" + after;
            else url =  "/" + value + "/sharedposts?fields=to{profile_type,name},from&limit=1000";
            
            //console.log(url);
            
            FB.api(url, function(response){
                if(response && ! response.error){
                    var data = response.data;
                    async.forEachOf(data, (item, key, callback) => {
                        if(item.to && item.to.data[0].profile_type == "group"){
                            var find =  shareDetails.find(function(ele){
                                return ele.shareGroupId == item.to.data[0].id;
                            });
                            
                            if(find){
                                ShareDetail.update({id  : find.id },{ status : 'Done', from : item.from.name, link : 'http://fb.com/' + item.id }).exec(function afterwards(err, updated){});
                            }
                            //console.log(JSON.stringify(item.from));
                        }
                        callback();
                    }, err => {})
                  
                    if(response.paging && response.paging.next) 
                        fetch(value, shareDetails ,response.paging.cursors.after);
                    } else {
                        //sails.sockets.broadcast('root', {msg : 'error: ' + JSON.stringify(response.error) });
                        console.log(response.error);
                    }
            });
}

var getCursorViewShare = function ( videoId, account, shareDetails,callback){
  var headers = {
   // "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.9",
    "accept" : "*/*",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" : account.cookie
  };
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/ajax/shares/view?target_fbid="+ videoId+"&av="+ account.__user +"&dpr=1&__asyncDialog=7"
          + "&__user=" + account.__user
          + "&__a=1&__req=223&__be=1&__pc=PHASED%3ADEFAULT&__rev=3658517&__spin_r=3658517&__spin_b=trunk&__spin_t=1518977456&ft\[tn\]=\]FHHH-R-R&ft\[top_level_post_id\]=773941866136723&ft\[qid\]=6523967144399196030&ft\[mf_story_key\]=773941866136723&ft\[tl_objid\]=773941866136723&ft\[src\]=10&ft\[fbfeed_location\]=2",
          method: 'GET',
          headers: headers
    };
    var chunks = [];
    
    var request =  https.request(options, (resp) => {
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                chunks.push(chunk);
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                var cursor = '';
                var buffer = Buffer.concat(chunks);
                var encoding = resp.headers['content-encoding'];
                if( encoding == 'br'){  
                  decompress(buffer, function(err, output) {
                    if(err) return callback(err);
                    var strContent = '';
                    if(output){ 
                        strContent =   output.toString();
                        for (var i = 0; i < shareDetails.length; i++) {
                            if(strContent.includes(shareDetails[i].account.__user)){
                                console.log(shareDetails[i].account.username + ' shared');
                                ShareDetail.update({id  : shareDetails[i].id },{ status : 'Done'}).exec(function afterwards(err, updated){});
                            }
                        }
                        var index = strContent.indexOf('\"cursor\":');
                        strContent = strContent.substring(index + 10  );
                        index = strContent.indexOf('\"}');
                        cursor  = strContent.substring(0, index);
                        console.log(cursor);
                        
                    }
                    callback(null,cursor);
                  });
                }
              });
         
        }).on("error", (err) => {
          callback(err);
          console.log("Error: " + err.message);
    });
    request.end();
}


var ResharesPagelet = function (videoId , account, shareDetails ,cursor){
  var headers = {
   // "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.9",
    "accept" : "*/*",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" :   account.cookie
  };
  
  
 // var cursor = 'AQHR4UU1sPBOyOS6l_WXiTR4is7ws0I2role60nLlnri-SNKKth6GVWxVDVnWzRNV1_koJE2d3V3elIwdmUEKxmlEw';
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/ajax/pagelet/generic.php/ResharesPagelet?dpr=1&data=%7B%22target_fbid%22%3A" + videoId +"%2C%22cursor%22%3A%22"
          + cursor+ "%22%2C%22pager_fired_on_init%22%3Atrue%7D"
          + "&__user="  + account.__user
          + "&__a=1"
          + "&__req=2ci&__be=1&__pc=PHASED%3ADEFAULT&__rev=3658517&__spin_r=3658517&__spin_b=trunk&__spin_t=1518977456",
          method: 'GET',
          headers: headers
    };
    var chunks = [];
    
    var request =  https.request(options, (resp) => {
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                chunks.push(chunk);
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                var cursor = '';
                var buffer = Buffer.concat(chunks);
                var encoding = resp.headers['content-encoding'];
                if( encoding == 'br'){  
                  decompress(buffer, function(err, output) {
                    //(err, );
                    var strContent = '';
                    if(output){ 
                        strContent =   output.toString();
                        for (var i = 0; i < shareDetails.length; i++) {
                            if(strContent.includes(shareDetails[i].account.__user)){
                                console.log(shareDetails[i].account.username + ' shared');
                                ShareDetail.update({id  : shareDetails[i].id },{ status : 'Done'}).exec(function afterwards(err, updated){});
                            }
                        }
                        var index = strContent.indexOf('\"cursor\":');
                        if(index < 0) return;
                        strContent = strContent.substring(index + 10  );
                        index = strContent.indexOf('\"}');
                        cursor  = strContent.substring(0, index);
                        console.log(cursor);
                        if(cursor.length > 0){
                          ResharesPagelet(videoId, account, shareDetails,cursor)
                        }
                      }
                  });
                }
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
    });
    request.end();
}


var completeLiveStreamJob = function(streamVideoId, videoId,completeBy,callback){
    var shareDetails = [];
    var account_global = {}
    var token = '';
     async.waterfall([
        function(cb){
            Settings.findOne({
                key : 'access_token'
              }).exec(function (err, finn){
                if (!err && finn ) {
                    token = finn.value;
                    FB.setAccessToken(token);
                }
                cb()
            });
        },
        function(cb){
                Settings.findOne({
                    key : 'account_global'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        account_global = JSON.parse(finn.value);
                    }
                    cb()
                });  
        },
        function(cb){
            ShareDetail.find({streamvideo : streamVideoId }).populate('account').exec(function(err, data) {
                if(err){
                    return cb(err);
                }
                shareDetails = data;
                //console.log('shareDetails:', shareDetails)
                cb();
            }); 
        },
        function(cb){
            getCursorViewShare(videoId, account_global,shareDetails,function(err, cursor){
              if(err) return console.log(err);
              ResharesPagelet(videoId, account_global,shareDetails ,cursor);
            });
            cb();
        },
        function(cb){
            StreamVideo.update({id: streamVideoId },{ status : 'Done',completeBy : completeBy , completeTime : new Date()}).exec(function afterwards(err, updated){});
            cb();
        }
    ], err => {
        callback();
    });
    
    
     
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'completeLiveStreamJob',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
       // frequency: 'every 1 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : completeLiveStreamJob");
            sails.log.info("Agenda job : completeLiveStreamJob, attr data: " , job.attrs.data);
            var streamVideoId = job.attrs.data.streamVideoId;
            var completeBy = job.attrs.data.completeBy;
            var videoId =  job.attrs.data.videoId;
            completeLiveStreamJob(streamVideoId, videoId,completeBy, function(err){
               done(); 
            });
            //done();
        },
    };
    return job;
}