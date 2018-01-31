/**
 * StreamVideoController
 *
 * @description :: Server-side logic for managing Streamvideos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
 var async = require("async");
const https = require('https');

function diff_minutes(dt2, dt1) 
{

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
}
 
var loadAccounts = function(sharePerAccount, callback){
    var accounts = [];
    AccountsFB.find().populate('ShareDetail').populate('openode').exec(function(err, data) {
        if(err) return callback(err);
        for (var i = 0; i < data.length; i++) {
            if(data[i].status != 'OK'){
                continue;
            }
            var shareDetail = data[i].ShareDetail;
            //console.log('shareDetail: ',shareDetail );
            var countShare = 0;
            for (var j = 0; j < shareDetail.length; j++) {
                var now = new Date();
                var diffM =  diff_minutes(now, new Date(shareDetail[j].createdAt));
                if( diffM <= sharePerAccount[0]*60 && shareDetail[j].status != 'Cancel'){
                    countShare ++;
                }
            }
           // console.log('countShare : ', countShare);
            if(countShare >= sharePerAccount[1]){
                continue;
            }
            
            if(data[i].openode == undefined || data[i].openode == null){
                continue;
            }
            
            accounts.push(data[i]);
            
            
        }
        //console.log('accounts:', accounts.length)
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
       var tmpMsgs = messages.slice();
       for (var i = 0; i < accounts.length; i++) {
           var index  = Math.floor(Math.random()*tmpMsgs.length);
           var message = tmpMsgs[index];
           accounts[i].messageShare = message.content;
           tmpMsgs.splice(index, 1);
           if(tmpMsgs.length <= 0) tmpMsgs = messages.slice();
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
var shareLiveStream2GroupsJob = function(url, sharesAmount, timeShareLimit , callback){
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
                if(accounts.length < sharesAmount )
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
                if(accounts.length < sharesAmount)
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
            StreamVideo.create({url : url,sharesAmount : sharesAmount, timeShareLimit : timeShareLimit, status : 'Init' }).exec(function createCB(err, created){
                if(err)
                    return callbackWaterfall(err);
                else callbackWaterfall(null, created.id);
            });   
        },
        function(streamVideoId, callbackWaterfall){

            for (var i = 0; i < accounts.length - sharesAmount ; i++) {
                var index  = Math.floor(Math.random()*accounts.length);
                accounts.splice(index, 1);
            }
            async.eachOfSeries(accounts, (item, key, cbEachOfSeries) => {
                var account = item;
                var group = {};
                Groups.findOne({
                    groupId : account.shareGroupId
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        group = finn;
                        //console.log('group :', group)
                        var shareDetail = {account : account.id, group : group.id, streamvideo : streamVideoId,shareGroupId : account.shareGroupId , messageShare :  account.messageShare, status : 'Init' };
                        ShareDetail.create(shareDetail).exec(function createCB(err1, created){
                            if(err1)
                                console.log(err1);
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
            return callback(err);
        }
        callback();
    });
}


module.exports = {
    createLiveStream : function(req, res){
        var sharesAmount = req.query.sharesAmount;
        var timeShareLimit = req.query.timeShareLimit;
        var url = req.query.url;
        shareLiveStream2GroupsJob(url, sharesAmount, timeShareLimit, function(err){
            if(err){
                res.json(500, { error: err })
                sails.sockets.broadcast('root', {alert : "ERROR, " + err});
            } else {
                sails.sockets.broadcast('root', {alert : 'SUCCESS :))'});
                res.json({ message : 'ok' });
            }
        });
       // Jobs.now('shareLiveStream2GroupsJob', {url : 'test url', videoId : videoId , sharesAmount : sharesAmount, timeShareLimit : timeShareLimit})
        
    },
    test : function(req, res){
        sails.sockets.broadcast('root', {alert : 'SUCCESS :))'});
        
        res.json({msg : 'OK'})
    }
	
};

