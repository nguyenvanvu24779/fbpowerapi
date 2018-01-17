const https = require('https');
var async = require("async");
 
var loadGroupsAccount = function() {
	    AccountsFB.find().then(function(accounts) {
          async.eachOfSeries(accounts, (item, key, callback) => {
             ScheduleJob.update({name: 'loadGroupsAccount' },{ progress :  (key + 1)/accounts.length}).exec(function afterwards(err, updated){});
              var account = item;
             
              if(account.__user == undefined || account.__user == null)  { 
                setTimeout(function(){callback()}, 15000) ;
                return;
              }
              // console.log(account);
                var options = { 
                      hostname: 'www.facebook.com',
                      path: "/bookmarks/groups",
                      method: 'GET',
                      headers: {'Cookie':  account.cookie ,
                                'user-agent' : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36"
                      }
                };
                var data = '';
                
                var request =  https.request(options, (resp) => {
                          // A chunk of data has been recieved.
                          resp.on('data', (chunk) => {
                            data += chunk;
                          });
                         
                          // The whole response has been received. Print out the result.
                          resp.on('end', () => {
                            //console.log('end' + data);
                            var regexp = /leave.php\?group_id=/g;
                            var match, matches = [];
                            var arrGroupId = [];
                            
                            while ((match = regexp.exec(data)) != null) {
                              matches.push(match.index);
                              arrGroupId.push(data.substring(match.index + 19, match.index + 19 + 15))
                            }
                           /// console.log(data);
                            //console.log("account: ", account);
                            AccountsFB.update({__user: account.__user},{ groups:arrGroupId }).exec(function afterwards(err, updated){
                                  if (err) {
                                    // handle error here- e.g. `res.serverError(err);`
                                    console.log(err);
                                     setTimeout(function(){callback(err)}, 15000) ;
                                    return;
                                  }
                                  console.log('Updated user to have name ' + updated[0].username);
                                   setTimeout(function(){callback()}, 15000) ;
                                });
                            });
                     
                    }).on("error", (err) => {
                      setTimeout(function(){callback()}, 15000) ;
                      console.log("Error: " + err.message);
                });
                request.end();
          } ,err =>  {} );
        }).catch(function(err){
          //....
        });
}
	
module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'loadGroupsAccount',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 75 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : Load Groups Accounts");
            loadGroupsAccount();
            done();
        },
    };
    return job;
}