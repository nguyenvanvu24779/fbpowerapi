var async = require("async");
var FB = require('fb');
FB.options({version: 'v2.11'});

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


var completeLiveStreamJob = function(streamVideoId, videoId,completeBy,callback){
    var shareDetails = [];
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
            ShareDetail.find({streamvideo : streamVideoId }).exec(function(err, data) {
                if(err){
                    return cb(err);
                }
                shareDetails = data;
                //console.log('shareDetails:', shareDetails)
                cb();
            }); 
        },
        function(cb){
            fetch(videoId, shareDetails, "");
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