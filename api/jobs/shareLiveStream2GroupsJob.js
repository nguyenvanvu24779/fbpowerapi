var async = require("async");
const https = require('https');
var Client = require('node-rest-client').Client;
var client = new Client();



var post2GroupVideo = function(videoId ,groupId, message, account ,callback){
    var __user =  account.__user;
    var cookie = account.cookie;
    var fb_dtsg = account.fb_dtsg;
    var jazoest = account.jazoest;
    
    var rest = client.get(`http://${account.openode.siteUrl}/post2GroupVideo?groupId=${groupId}&message=${message}&c_user=${__user}&cookie=${cookie}&fb_dtsg=${fb_dtsg}&jazoest=${jazoest}&videoId=${videoId}&userAgent=${sails.config.globals.userAgent}`, function (data, response) {
        callback();      
    });
    rest.on('error', function (err) {
        console.log('[post2GroupVideo] request error', err);
        callback(err);
    });
}
var shareLiveStream2GroupsJob = function(videoId, streamVideoId, timeShareLimit,callback){
    var shareDetails = [];
    async.waterfall([
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
            async.eachOfSeries(shareDetails, (item, key, cbEachOfSeries) => {
                var account = {};
                AccountsFB.findOne({
                    id : item.account
                }).populate('openode').exec(function (err, finn){
                    if (!err && finn ) {
                        account  = finn;
                        console.log('[shareLiveStream2GroupsJob] post2GroupVideo: ', account);
                        if(account.openode)
                            post2GroupVideo(videoId, item.shareGroupId, item.messageShare,account, function(err, data){
                                
                            });
                    }
                    setTimeout(function(){cbEachOfSeries();}, shareDetails.length > 1 ?  (timeShareLimit*60/shareDetails.length)*1000 : 1000)  ;
                }); 
            }, err =>{
                callbackWaterfall();
            })
        }
    ], err => {
        StreamVideo.update({id: streamVideoId },{ status : 'Done' }).exec(function afterwards(err, updated){})
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