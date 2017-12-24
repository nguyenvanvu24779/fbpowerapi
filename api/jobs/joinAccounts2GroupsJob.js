const https = require('https');
var async = require("async");

var Join2Group =  function(account, groupId) {
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
                          'user-agent' : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36"
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
    //console.log('[Join2GroupAnswer]')
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
                          'user-agent' : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36"
                }
    };
  //  console.log('[Join2GroupAnswer] options:', options )
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
  //  console.log('[Join2GroupAnswer] params', params );
    request.write(encodeURI(params));
    request.end();
    
} 

var JoinAccounts2Groups = function(){
    var groups = [];
    async.waterfall([
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
            AccountsFB.find().then(function(accounts) {
                async.eachOfSeries(accounts, (item, key, callback) => {
                    var account = item;
                    if(account.__user == undefined || account.__user == null )
                        return callback('checkpoint');
                    for (var i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        
                        if(account.groups && account.groups.length > 0){
                            var findAcc =  account.groups.find(function(ele){
                                return ele == group.groupId;
                            })
                            if(findAcc != undefined)
                                return callback('joined');
                        }
                        
                        if(account.groupsRequest && account.groupsRequest.length > 0){
                            var findAcc =  account.groupsRequest.find(function(ele){
                                return ele == group.groupId;
                            })
                            if(findAcc != undefined)
                                return callback('requested');
                        }
                        if(group.question &&  group.question.length > 0){
                            if(group.answer == undefined) return callback('answer');
                            if(group.answer &&  group.answer.length == 0) return callback('answer');
                        } 
                            
                        
                        Join2Group(account,  group.groupId);
                        if(group.question && group.question.length > 0){
                            Join2GroupAnswer(account, group.groupId, group.question, group.answer)
                        }
                        var groupsRequest = account.groupsRequest ? account.groupsRequest : []; 
                        groupsRequest.push(group.groupId);
                        AccountsFB.update({__user:  account.__user},{ groupsRequest : groupsRequest }).exec(function afterwards(err, updated){});
                    }
                    callback();
                }, err => {
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
        frequency: 'every 120 minutes',

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