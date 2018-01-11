var async = require("async");
const https = require('https');

function diff_minutes(dt2, dt1) 
{

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
}
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}
 
var loadAccounts = function(sharePerAccount, callback){
    var accounts = [];
    AccountsFB.find().populate('ShareDetail').exec(function(err, data) {
        if(err) return callback(err);
        for (var i = 0; i < data.length; i++) {
            if(data[i].status != 'OK'){
                continue;
            }
            var shareDetail = data[i].ShareDetail;
            var countShare = 0;
            for (var j = 0; j < shareDetail.length; j++) {
                var now = new Date();
                var diffM =  diff_minutes(now, new Date(shareDetail[j].timeShare));
                if( diffM <= sharePerAccount[0]*60 ){
                    countShare ++;
                }
            }
            if(countShare >= sharePerAccount[1]){
                continue;
            }
            
            accounts.push(data[i]);
            
            
        }
        callback(null, accounts);
    });
}
var loadGroups = function(groupMemberRequire ,accounts, callback){
    console.log('[loadGroups] groupMemberRequire: ' + groupMemberRequire);
    Groups.find().populate('ShareDetail').exec(function(err, groups){
        if(err) return callback(err);
        for (var l = groups.length - 1 ; l >=0 ; l--) {
            if(parseInt(groups[l].countMembers) < groupMemberRequire ){
                //console.log('[loadGroups] groups.splice: ', groups[l]);
                groups.splice(l, 1); 
                
            }
        }
        //console.log('[loadGroups] groups.length: ' + groups.length);
        for (var i = accounts.length - 1 ; i >= 0 ; i--) {
            var groupsSys = [];
            if(accounts[i].groups){
            var filter =  accounts[i].groups.filter(function(elm){
                   for (var k = 0; k < groups.length; k++) {
                         if(groups[k].groupId == elm ) return true;
                   }
                   return false;
               })
            }
            if(filter.length == 0){
                accounts.splice(i, 1);
            } else {
                accounts[i].groups = filter;
                var index  = Math.floor(Math.random()*accounts[i].groups.length);
                accounts[i].shareGroupId = accounts[i].groups[index];
                for (var j = 0; j < groups.length; j++) {
                    if(groups[j].groupId ==  accounts[i].shareGroupId)
                    {
                        groups.splice(j, 1);
                        break;
                    }
                }
            }
            
            
            
            
        }
        callback(null, accounts)
    });
    
}

var loadMessages = function(accounts,  callback){
    ContentShare.find().exec(function(err, messages){
       if(err) return callback(err);
       var tmpMsgs = messages;
       for (var i = 0; i < accounts.length; i++) {
           var index  = Math.floor(Math.random()*tmpMsgs.length);
           var message = tmpMsgs[index];
           accounts[i].messageShare = message.content;
           tmpMsgs.splice(index, 1);
           if(tmpMsgs.length <= 0) tmpMsgs = messages;
       }
       callback(null,accounts);
       
    });
}
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
var shareLiveStream2GroupsJob = function(videoId, shareAmount, timeShare, callback){
    var groups = [];
    var accounts = [];
    var sharePerAccount = [1, 3];
    var messages = [];
    var groupMemberRequire = 10000;
    async.waterfall([
        function(callbackWaterfall){
                Settings.findOne({
                    key : 'sharePerAccount'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        sharePerAccount = JSON.parse(finn.value);
                    }
                    callbackWaterfall()
                });
        },
        function(callbackWaterfall){
                Settings.findOne({
                    key : 'groupMemberRequire'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        groupMemberRequire = finn.value;
                    }
                    callbackWaterfall()
                });
        },
        function(callbackWaterfall){
             loadAccounts(sharePerAccount, function(err, data){
                if(err) return callbackWaterfall(err);
                accounts = data;
                //console.log('[shareLiveStream2GroupsJob] loadAccounts: ', accounts);
                if(accounts.length < shareAmount )
                    return callbackWaterfall('accounts not available')
                callbackWaterfall();
             });
        },
        function(callbackWaterfall){
            loadGroups(groupMemberRequire,accounts,function(err, data){
                if(err) 
                    return callbackWaterfall(err);
                accounts = data;
               // console.log('[shareLiveStream2GroupsJob] loadGroups: ', accounts);
                if(accounts.length < shareAmount)
                     return callbackWaterfall('groups not available')
                callbackWaterfall();
            })
        },
        function(callbackWaterfall){
            loadMessages(accounts,function(err, data){
                if(err) 
                    return callbackWaterfall(err);
                accounts = data;
                callbackWaterfall();
            })
        },
        function(callbackWaterfall){
            async.eachOfSeries(accounts, (item, key, cbEachOfSeries) => {
                var account = item;
                console.log('[shareLiveStream2GroupsJob] post2GroupVideo: ', account);
                post2GroupVideo(videoId, account.shareGroupId, account.messageShare,account, function(err, data){
                    
                })
                cbEachOfSeries();
               
            }, err =>{
                
            })
        }
    ], err => {
        if(err)
        {
            console.log('[shareLiveStream2GroupsJob] err:', err );
            callback(err);
        }
    });
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'shareLiveStream2GroupsJob',

        // set true to disabled this job
        //disabled: false,

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
            shareLiveStream2GroupsJob(job.attrs.data.videoId,job.attrs.data.sharesAmount, job.attrs.data.timeShareLimit, function(err){
                
            })
            done();
        },
    };
    return job;
}