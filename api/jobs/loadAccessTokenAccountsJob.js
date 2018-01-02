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

var loadAccessTokenAccounts = function(){
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
                        //console.log(data);
                    }
                });
               // if(account.access_token) 
                //    return callback();
                /*
                var sig = "api_key=882a8490361da98702bf97a021ddc14d" 
                +"email=" + account.username
                +"format=JSONlocale=vi_vnmethod=auth.loginpassword="+ account.password
                +"return_ssl_resources=0v=1.062f8ce9f74b12f84c123cc23437a4a32";
                
                var urlParam = "api_key=882a8490361da98702bf97a021ddc14d"
                +"&email=" + account.username
                +"&format=JSON&locale=vi_vn&method=auth.login"
                +"&password=" + account.password
                +"&return_ssl_resources=0&v=1.0"
                +"&sig=" + md5(sig);
                
                var options = { 
                    hostname: 'api.facebook.com',
                    path: "/restserver.php?" +  urlParam,
                    method: 'GET',
                    headers: {//'Cookie':  cookie,
                              //'Content-Type': 'application/x-www-form-urlencoded',
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
                        console.log(account.username)
                       console.log('access_token : ' ,(JSON.parse(data)));
                       
                        var jsonData = JSON.parse(data);
                        var access_token = jsonData.access_token;
                    
                        var fb_dtsg = '';
                        var jazoest = '';
                        if(access_token){
                            genFullInfoFromCooike(account.cookie, function(err, data){
                                if(err) 
                                    console.log(err)
                                else{
                                    fb_dtsg = data.fb_dtsg;
                                    jazoest = data.jazoest;
                                    console.log(data);
                                }
                            });
                        }
                        AccountsFB.update({__user:  account.__user},{ access_token :  access_token ,fb_dtsg : fb_dtsg,   jazoest : jazoest }).exec(function afterwards(err, updated){});
                        callback();
                      });
                 
                }).on("error", (err) => {
                  console.log("Error: " + err.message);
                  callback()
                  
                });
                request.end();
                */
            } else callback()
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
        name: 'loadAccessTokenAccountsJob',

        // set true to disabled this job
        disabled: true,

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
            sails.log.info("Agenda job : loadAccessTokenAccountsJob");
            loadAccessTokenAccounts();
            done();
        },
    };
    return job;
}