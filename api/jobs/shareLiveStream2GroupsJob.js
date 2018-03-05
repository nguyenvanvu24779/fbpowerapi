var async = require("async");
const https = require('https');
var Client = require('node-rest-client').Client;
var client = new Client();
var FB = require('fb');
FB.options({version: 'v2.11'});


var post2GroupVideo = function(videoId ,groupId, message, account ,callback){
    var __user =  account.__user;
    var cookie = account.cookie;
    var fb_dtsg = account.fb_dtsg;
    var jazoest = account.jazoest;
    
    var url = `http://${account.openode.siteUrl}/post2GroupVideo?groupId=${groupId}&message=${message}&c_user=${__user}&cookie=${cookie}&fb_dtsg=${fb_dtsg}&jazoest=${jazoest}&videoId=${videoId}&userAgent=${sails.config.globals.userAgent}`;
    
    var rest = client.get(encodeURI(url), function (data, response) {
        callback();      
    });
    rest.on('error', function (err) {
        console.log('[post2GroupVideo] request error', err);
        callback(err);
    });
}

var sendLike = function(feedId ,groupId, account ,callback){
    var __user =  account.__user;
    var cookie = account.cookie;
    var fb_dtsg = account.fb_dtsg;
    var jazoest = account.jazoest;
    var userAgent = sails.config.globals.userAgent;
    
    var url = `http://${account.openode.siteUrl}/sendLike?feedId=${feedId}&groupId=${groupId}&c_user=${__user}&cookie=${cookie}&fb_dtsg=${fb_dtsg}&jazoest=${jazoest}&userAgent=${userAgent}`;
    
    var rest = client.get(encodeURI(url), function (data, response) {
        callback();      
    });
    rest.on('error', function (err) {
        console.log('[sendLike] request error', err);
        callback(err);
    });
}


var sendComment = function(feedId , content ,groupId, account ,callback){
    var __user =  account.__user;
    var cookie = account.cookie;
    var fb_dtsg = account.fb_dtsg;
    var jazoest = account.jazoest;
    var userAgent = sails.config.globals.userAgent;
    
    var url = `http://${account.openode.siteUrl}/sendComment?content=${content}&feedId=${feedId}&groupId=${groupId}&c_user=${__user}&cookie=${cookie}&fb_dtsg=${fb_dtsg}&jazoest=${jazoest}&userAgent=${userAgent}`;
    
    var rest = client.get(encodeURI(url), function (data, response) {
        callback();      
    });
    rest.on('error', function (err) {
        console.log('[sendComment] request error', err);
        callback(err);
    });
}



var getFeedId = function (token, groupId, callback ) { 
    var  url =  "/" + groupId + "?fields=feed{type,message}";
    //console.log(url);
    FB.api(url, function(response){
        var arrFeedId = [];
        if(response && !response.error){
            var data = response.feed.data;
            if(data[0] && data[1] && data[2] && data[3]){
              console.log(data[0]);
              console.log(data[0].id.substring(data[0].id.length - 16));
              console.log(data[1]);
              console.log(data[1].id.substring(data[1].id.length - 16));
              console.log(data[2]);
              console.log(data[2].id.substring(data[2].id.length - 16));
              console.log(data[3]);
              console.log(data[3].id.substring(data[3].id.length - 16));
              
              arrFeedId.push(data[0].id.substring(data[0].id.length - 16));
              arrFeedId.push(data[1].id.substring(data[1].id.length - 16));
              arrFeedId.push(data[2].id.substring(data[2].id.length - 16));
              arrFeedId.push(data[3].id.substring(data[3].id.length - 16));
              callback(null, arrFeedId);
            } else callback('FeedId empty') 
        } else {
          console.log(response.error);
          callback(response.error)
        }
    });
}
var shareLiveStream2GroupsJob = function(videoId, streamVideoId, timeShareLimit,callback){
    var shareDetails = [];
    var token = '';
    async.waterfall([
        function(callbackWaterfall){
            Settings.findOne({
                key : 'access_token'
            }).exec(function (err, finn){
                if (!err && finn ) {
                    token = finn.value;
                }
                callbackWaterfall();
            });
        },
        function(callbackWaterfall){
             ShareDetail.find({streamvideo : streamVideoId }).exec(function(err, data) {
                if(err){
                    return callbackWaterfall(err);
                }
                shareDetails = data;
                //console.log('shareDetails:', shareDetails)
                callbackWaterfall();
             });
               
        },
        function(callbackWaterfall){
          if(shareDetails.length > 0) {
              
              
              setTimeout(function(){callbackWaterfall()}, 1000*60*5);
          }
        },
        function(callbackWaterfall){
            async.eachOfSeries(shareDetails, (item, key, cbEachOfSeries) => {
                var account = {};
                AccountsFB.findOne({
                    id : item.account
                }).populate('openode').exec(function (err, finn){
                    if (!err && finn ) {
                        account  = finn;
                        console.log('[shareLiveStream2GroupsJob] post2GroupVideo: ', account.username);
                        console.log('[shareLiveStream2GroupsJob] groupId: ',  item.shareGroupId);
                        console.log('[shareLiveStream2GroupsJob] videoId: ',  videoId);
                        if(account.openode){
                            ShareDetail.update({id: item.id },{ status : 'Processing' }).exec(function afterwards(err, updated){})
                           
                            getFeedId(token, item.shareGroupId, function(err, data){
                                async.eachOfSeries(data, (it, k, cbEachOfSeriesFeedId) => {
                                    if(k % 2 == 0 ){
                                        sendLike(it, item.shareGroupId, account, function(err){
                                     
                                        })
                                    } else {
                                        sendComment(it, '...', item.shareGroupId, account, function(err){
                                         
                                        })
                                    }
                                    setTimeout(function() {cbEachOfSeriesFeedId()}, 15000);
                                }, err => {})
                            });
                            setTimeout(function() {
                                post2GroupVideo(videoId, item.shareGroupId, item.messageShare,account, function(err){
                                });
                            }, 1000 * 60 * 5)
                           
                        }
                    }
                    setTimeout(function(){cbEachOfSeries();}, shareDetails.length > 1 ?  (timeShareLimit*60/shareDetails.length)*1000 : 1000)  ;
                }); 
            }, err =>{
                callbackWaterfall();
            })
        }
    ], err => {
        setTimeout(function(){
            Jobs.now('completeLiveStreamJob', { videoId : videoId , streamVideoId : streamVideoId, completeBy : 'System' });
        }, 1000 * 60 * 5 ) ;
        if(err)
        {
            console.log('[shareLiveStream2GroupsJob] err:', err );
            callback(err);
        } else callback();
    });
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'shareLiveStream2GroupsJob',

        // set true to disabled this job
        //disabled: true,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        //frequency: 'every 60 minutes',

        // Jobs options
        options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            priority: 'highest'
        },

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : shareLiveStream2GroupsJob");
            sails.log.info("Agenda job : shareLiveStream2GroupsJob, attr Data: ", job.attrs.data);
            shareLiveStream2GroupsJob(job.attrs.data.videoId,job.attrs.data.streamVideoId, job.attrs.data.timeShareLimit, function(err){
                
            })
            done();
        },
    };
    return job;
}