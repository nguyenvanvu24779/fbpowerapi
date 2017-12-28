const https = require('https');
var async = require("async");
var md5 = require('md5');

var loadAccessTokenAccounts = function(){
    AccountsFB.find().then(function(accounts) {
        async.eachOfSeries(accounts, (item, key, callback) => {
            var account = item;
            if(account.__user){
                if(account.access_token) 
                    return callback();
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
                       // console.log('access_token : ' + (JSON.parse(data)).access_token);
                        var jsonData = JSON.parse(data);
                        var access_token = jsonData.access_token
                        if(access_token)
                            AccountsFB.update({__user:  account.__user},{ access_token :  access_token  }).exec(function afterwards(err, updated){});
                        callback();
                          
                      });
                 
                }).on("error", (err) => {
                  console.log("Error: " + err.message);
                  callback()
                  
                });
                request.end();
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
       // disabled: true,

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