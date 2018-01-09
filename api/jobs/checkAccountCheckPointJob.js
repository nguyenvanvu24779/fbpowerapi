const https = require('https');
var async = require("async");
const decompress = require('iltorb').decompress;

var requestWithEncoding = function(groupsId, user, callback) {
    
    var headers = {
      "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
      "accept-language" : "en-US,en;q=0.8",
      "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0",
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



var checkAccountCheckPointJob = function(){
    AccountsFB.find().then(function(accounts) {
        //console.log(accounts)
        async.eachOfSeries(accounts, (item, key, callback) => {
            var account = item;
            if(account.__user) 
                requestWithEncoding('748487905348786', account, function(err, data){
                   if(err) return console.log(err);
                   console.log('[checkAccountCheckPointJob] account: ', account.username);
                   //console.log(data);
                   if(data.includes('Dev fb 3')){
                        console.log('account ok');
                        AccountsFB.update({__user:  account.__user},{ status : 'OK' }).exec(function afterwards(err, updated){
                             callback();
                        });
                   }
                   else {
                        console.log('checkpoint account');
                        AccountsFB.update({__user:  account.__user},{ status : 'checkpoint' }).exec(function afterwards(err, updated){
                             callback();
                        });
                      
                   }
                  
                  
                })
            else {
                callback();
                 AccountsFB.update({__user:  account.__user},{ status : 'fail' }).exec(function afterwards(err, updated){});
            }
            
        }, err => {
            
        });
    }).catch(function(err){
        
    });
    
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'checkAccountCheckPointJob',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 30 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : checkAccountCheckPointJob");
            checkAccountCheckPointJob();
            done();
        },
    };
    return job;
}