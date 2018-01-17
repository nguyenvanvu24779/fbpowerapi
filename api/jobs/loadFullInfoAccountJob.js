const https = require('https');
var async = require("async");
var md5 = require('md5');
const decompress = require('iltorb').decompress;

function getStrings(test_str, text_begin, text_end) {
      var start_pos = test_str.indexOf(text_begin);
      if (start_pos < 0) {
         return '';
      }
      start_pos += text_begin.length;
      var end_pos = test_str.indexOf(text_end, start_pos);
      var text_to_get = test_str.substring(start_pos, end_pos);
      return text_to_get;
}

var genFullInfoFromCooike = function(cookie, callback){
  var headers = {
    "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.8",
    "accept" : "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" :  cookie
  };
  
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/",
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
                var buffer = Buffer.concat(chunks);
                var encoding = resp.headers['content-encoding'];
                if( encoding == 'br'){  
                  decompress(buffer, function(err, output) {
                    //(err, );
                    var strContent = '';
                    if(output){ 
                      strContent =   output.toString();
                      var fb_dtsg  = getStrings(strContent , '{"token":"', '"')
                      var jazoest = '';
                      for (var i = 0; i < fb_dtsg.length; i++) jazoest += fb_dtsg.charCodeAt(i);
                      //console.log(jazoest);
                      return callback(null, {fb_dtsg : fb_dtsg, jazoest : jazoest})
                    } else callback('null')
                  });
                }// callback('null')
                
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
          callback(err);
    });
    request.end();
  
}


var loadFullInfoAccountJob = function(){
    var account_global = {}
    Settings.findOne({
        key : 'account_global'
    }).exec(function (err, finn){
        if (!err && finn ) {
             account_global = JSON.parse(finn.value);
             if(account_global.cookie){
                var fb_dtsg = '';
                var jazoest = '';
                
                genFullInfoFromCooike(account_global.cookie, function(err, data){
                    if(err) 
                        console.log(err)
                    else{
                        fb_dtsg = data.fb_dtsg;
                        jazoest = data.jazoest;
                        AccountsFB.update({__user:  account_global.__user},{ fb_dtsg :  fb_dtsg ,jazoest : jazoest }).exec(function afterwards(err, updated){});
                        console.log('[loadFullInfoAccountJob] account_global');
                        
                    }
                });
             }
        }
                    
    });
    AccountsFB.find().then(function(accounts) {
        async.eachOfSeries(accounts, (item, key, callback) => {
            var account = item;
            if(account.__user){
                var fb_dtsg = '';
                var jazoest = '';
                
                genFullInfoFromCooike(account.cookie, function(err, data){
                    if(err) 
                        console.log(err)
                    else{
                        fb_dtsg = data.fb_dtsg;
                        jazoest = data.jazoest;
                        
                        if(fb_dtsg.length < 10){
                             AccountsFB.update({__user:  account.__user},{ status : 'checkpoint' }).exec(function afterwards(err, updated){});
                        }  else AccountsFB.update({__user:  account.__user},{ fb_dtsg :  fb_dtsg ,jazoest : jazoest }).exec(function afterwards(err, updated){});
                    
                       
                    }
                    console.log('[loadFullInfoAccountJob] username: ' + account.username);
                    console.log('[loadFullInfoAccountJob] jazoest: ' + jazoest);
                    console.log('[loadFullInfoAccountJob] fb_dtsg: ' + fb_dtsg);
                    console.log('[loadFullInfoAccountJob] jazoest: ' + jazoest);
                   
                    setTimeout(function(){callback();}, 15000 ) 
                });
            } else  setTimeout(function(){callback();}, 15000 ) 
        },err => {
            
        });
    }).catch(function(err){
          //....
    });
}


module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'loadFullInfoAccountJob',

        // set true to disabled this job
        //disabled: true,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 165 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
          //  priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : loadFullInfoAccountJob");
            loadFullInfoAccountJob();
            done();
        },
    };
    return job;
}