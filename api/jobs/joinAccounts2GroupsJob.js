const https = require('https');
var async = require("async");

function diff_minutes(dt2, dt1) 
{

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
}

var Join2Group =  function(account, groupId) {
    console.log((new Date()).toTimeString() +  ' [Join2Group] account: ' + account.username )
    var cookie = account.cookie;
    var params = "ref=group_jump_header"
    +"&group_id=" + groupId
    +"&client_custom_questions=1"
    +"&__user=" + account.__user
    +"&__a=1"
    +"&__dyn=" + account.__dyn
    +"&__req=q&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548041"
    +"&fb_dtsg=" + account.fb_dtsg
    +"&jazoest=" + account.jazoest
    +"&__spin_r=3548041&__spin_b=trunk&__spin_t=1514077825";
    
    var options = { 
                hostname: 'www.facebook.com',
                path: "/ajax/groups/membership/r2j.php?dpr=1",
                method: 'POST',
                headers: {'Cookie':  cookie,
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'user-agent' : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36"
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
          });
     
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
    
    request.write(params);
    request.end();
}

var Join2GroupAnswer = function (account, groupId, question, answers){
    console.log('[Join2GroupAnswer]')
    var cookie = account.cookie; 
    var params = "fb_dtsg=" + account.fb_dtsg;
    
    for (var i = 0; i < answers.length; i++) {
        var answer = answers[i];
        var arrAnswer = answer.split('|');
        var randomItem = arrAnswer[Math.floor(Math.random()*arrAnswer.length)];
        params = params + "&questionnaire_answers["+ i +"]=" +  randomItem;
    }
   
    params = params +"&__user="+ account.__user
    +"&__a=1"
    +"&__dyn=" + account.__dyn
    +"&__req=12&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548041"
    +"&jazoest=" + account.jazoest
    +"&__spin_r=3548041&__spin_b=trunk&__spin_t=1514077582";
    
    var customQuestions = '';
    
    for (var j = 0; j < question.length; j++) {
        customQuestions = customQuestions + '&custom_questions['+ j + ']=' + question[j].replace(/<\/?[^>]+(>|$)/g, "") ;
    }
    
    var options = { 
                hostname: 'www.facebook.com',
                path: "/groups/membership_criteria_answer/save/?group_id="+ groupId + "&dpr=1" +   encodeURI(customQuestions),
                method: 'POST',
                headers: {'Cookie':  cookie,
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36"
                }
    };
   // console.log('[Join2GroupAnswer] options:', options )
    var request =  https.request(options, (resp) => {
          var data = '';
         
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
         
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
           // console.log('end' + data);
          });
     
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
    // console.log('[Join2GroupAnswer] params', params );
    request.write(encodeURI(params));
    request.end();
    
} 

var JoinAccounts2Groups = function(){
    console.log('[JoinAccounts2Groups]')
    var groups = [];
    var groupMemberRequire = 10000;
    var maxGroupPerAccount = 200;
    var timeJoinGroupPerAccount = [1,1];
    var nextRunAt = new Date();
    async.waterfall([
        function(cb){
                Settings.findOne({
                    key : 'groupMemberRequire'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        groupMemberRequire = parseInt(finn.value);
                    }
                    cb()
                });  
        },
        function(cb){
                Settings.findOne({
                    key : 'maxGroupPerAccount'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        maxGroupPerAccount = parseInt(finn.value);
                    }
                    cb()
                });  
        },
        function(cb){
                Settings.findOne({
                    key : 'timeJoinGroupPerAccount'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        timeJoinGroupPerAccount = JSON.parse(finn.value);
                    }
                    cb()
                });  
        },
        function(cb){
            Groups.find().then(function(data) {
                groups = data;
                cb()
                 
            }).catch(function(err){
                //....
                cb(err);
            });
        },
        function(cb){
            ScheduleJob.find({name :'joinAccounts2Groups',  nextRunAt: { $not : { $type : 10 } ,  $exists : true } }).exec(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    nextRunAt = new Date(data[0].nextRunAt); 
                    console.log('[JoinAccounts2Groups] nextRunAt:' + nextRunAt);
                }
                cb()
            });
        },
        function(cb){
            AccountsFB.find().then(function(accounts) {
                async.each(accounts, (item, callback) => {
                    var account = item;
                    if(account.__user == undefined || account.__user == null ){
                       
                        return callback();
                    }
                    var count = 0;
                    for (var i = 0; i < account.groups.length; i++) {
                        var find =  groups.find(function(ele){
                                return ele.groupId == account.groups[i];
                        });
                        //console.log(find);
                        if(find &&  find.countMembers && find.countMembers > groupMemberRequire ){
                            count ++;
                        }
                    }
                    
                    if(count > maxGroupPerAccount){
                        console.log('[JoinAccounts2Groups] count:' , count);
                        return callback();
                    }
                    
                    var tmpGroups = groups.slice();
                    for (var i = 0; i < groups.length - maxGroupPerAccount; i++) {
                         var index  = Math.floor(Math.random()*tmpGroups.length);
                           tmpGroups.splice(index, 1);
                    }                      
                    
                        
                    async.eachOfSeries(tmpGroups, (group, k, callbackGroups) => {
                        // console.log('account: ', account);
                        //console.log('group: ', group);
                        
                        var now = new Date();
                	    if( now.getTime() >= nextRunAt.getTime() ){
                	        console.log('nextRunAt:' + nextRunAt);
                	        return callbackGroups('nextRunAt:' + nextRunAt)
                	    } 
            	        if(account.groups && account.groups.length > 0){
                            var findAcc =  account.groups.find(function(ele){
                                return ele == group.groupId;
                            })
                            if(findAcc != undefined)
                               return callbackGroups();
                               // return callback('joined');
                        }
                
                        if(account.groupsRequest && account.groupsRequest.length > 0){
                            var findAcc =  account.groupsRequest.find(function(ele){
                                return ele == group.groupId;
                            })
                            if(findAcc != undefined)
                               return callbackGroups();
                               // return callback('requested');
                        }
                        if(group.question &&  group.question.length > 0){
                            if(group.answer == undefined) return callbackGroups();
                            if(group.answer &&  group.answer.length == 0) return callbackGroups();
                        } 
                        
                        if(group.countMembers == undefined || group.countMembers == null){
                            return callbackGroups();
                        }
                        if(group.countMembers < groupMemberRequire){
                             return callbackGroups();
                        }
                            
                        
                        Join2Group(account,  group.groupId);
                        if(group.question && group.question.length > 0){
                            Join2GroupAnswer(account, group.groupId, group.question, group.answer)
                        }
                        var groupsRequest = account.groupsRequest ? account.groupsRequest : []; 
                        groupsRequest.push(group.groupId);
                        AccountsFB.update({__user:  account.__user},{ groupsRequest : groupsRequest }).exec(function afterwards(err, updated){
                            account.groupsRequest  = updated[0].groupsRequest;
                        });
                        setTimeout(function() {
                            callbackGroups();
                        }, (timeJoinGroupPerAccount[0]/timeJoinGroupPerAccount[1])*60000*60); 
            	        
                	    
                    	
                    }, err => {
                        setTimeout(function(){callback();}, 5000);
                    });
                    
                }, err => {
                    if(err) console.log(err)
                    cb();
                });
            }).catch(function(err){
                  //....
                  cb();
            });
        }
    ],function(error,success ){
            
    });
   
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'joinAccounts2Groups',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 100 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : joinAccounts2Groups");
            JoinAccounts2Groups();
            done();
        },
    };
    return job;
}