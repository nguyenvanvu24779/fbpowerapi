var async = require("async");
const https = require('https');


var post2GroupVideo = function(videoId ,groupId, message, account ,callback){
    var __user =  account.__user;
    var cookie = account.cookie;
    var fb_dtsg = account.fb_dtsg;
    var jazoest = account.jazoest;
    var urlParameters = 
                "composer_entry_time=7"+
                "&composer_session_id=de9f2c9a-8d7e-4bc4-87bd-6c988817e04d"+
                "&composer_session_duration=2774"+
                "&composer_source_surface=group"+
                "&hide_object_attachment=false"+
                "&num_keystrokes=16"+
                "&num_pastes=0"+
                "&privacyx&ref=group"+
                "&xc_sticker_id=0"+
                "&target_type=group"+
                "&xhpc_message="+  encodeURI(message)  +
                "&xhpc_message_text="+ encodeURI(message)  +
                "&is_react=true"+
                "&xhpc_composerid=rc.u_jsonp_4_r"+
                "&xhpc_targetid=" + groupId +
                "&xhpc_context=profile"+
                "&xhpc_timeline=false"+
                "&xhpc_finch=false"+
                "&xhpc_aggregated_story_composer=false"+
                "&xhpc_publish_type=1"+
                "&xhpc_fundraiser_page=false"+
                "&__user=" + __user +
                "&__a=1"+
               // "&__dyn="+ __dyn + 
                "&__req=49"+
                "&__be=1"+
                "&__pc=EXP1%3Ahome_page_pkg"+
                "&__rev=3453879"+
                "&fb_dtsg="+ fb_dtsg + 
                "&jazoest="+ jazoest + 
                "&__spin_r=3453879"+
                "&__spin_b=trunk"+
                "&__spin_t=1510641759"+
                "&attachment[type]=11"+
                "&attachment[params][0]=" + videoId +
                "&attachment[reshare_original_post]=false"+
                "&xc_share_params=[" + videoId + "]" +
                "&xc_share_target_type=11"
	    
	    var options = { 
            hostname: 'www.facebook.com',
            path: "/ajax/updatestatus.php?av=" + __user +  "&dpr=1",
            method: 'POST',
            headers: {'Cookie': cookie,
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
            }
        };
	    var request =  https.request(options, (resp) => {
              var data = '';
             
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
               // console.log('end' + data);
               callback();
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
          callback(err);
        });
      
      request.write(urlParameters);
      request.end();
}
var shareLiveStream2GroupsJob = function(videoId, streamVideoId, callback){
    var shareDetails = [];
    async.waterfall([
        function(callbackWaterfall){
             ShareDetail.find({streamvideo : streamVideoId }).exec(function(err, data) {
                if(err){
                    return callbackWaterfall(err);
                }
                shareDetails = data;
                console.log('shareDetails:', shareDetails)
                callbackWaterfall();
             });
               
        },
        function(callbackWaterfall){
            async.eachOfSeries(shareDetails, (item, key, cbEachOfSeries) => {
                var account = {};
                AccountsFB.findOne({
                    id : item.account
                }).exec(function (err, finn){
                    if (!err && finn ) {
                        account  = finn;
                        console.log('[shareLiveStream2GroupsJob] post2GroupVideo: ', account);
                        post2GroupVideo(videoId, item.shareGroupId, item.messageShare,account, function(err, data){
                            
                        });
                    }
                    cbEachOfSeries();
                }); 
               
               
                
                
               
            }, err =>{
                callbackWaterfall();
            })
        }
    ], err => {
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
            shareLiveStream2GroupsJob(job.attrs.data.videoId,job.attrs.data.streamVideoId, function(err){
                
            })
            done();
        },
    };
    return job;
}