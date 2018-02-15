const https = require('https');
var async = require("async");
var Client = require('node-rest-client').Client;
var client = new Client();

 
var loadGroupsAccount = function() {
	    AccountsFB.find().populate('openode').then(function(accounts) {
          async.eachOfSeries(accounts, (item, key, callback) => {
              
              var account = item;
              if(account.__user == undefined || account.__user == null || account.openode == undefined || account.status != 'OK')  { 
                return callback();
              }
              
              var url = `http://${account.openode.siteUrl}/countGroupsAccount?cookie=${account.cookie}&userAgent=${sails.config.globals.userAgent}`;
              var rest = client.get(encodeURI(url),function (data, response) {
                console.log(data);
                if(data.data){
                   AccountsFB.update({__user: account.__user},{ groups:data.data }).exec(function afterwards(err, updated){
                    if (err) {
                      // handle error here- e.g. `res.serverError(err);`
                      console.log(err);
                      setTimeout(function(){callback(err)}, 15000) ;
                      return;
                    }
                    
                    console.log('Updated user to have name ' + updated[0].username);
                    
                  });
                }
                setTimeout(function(){callback()}, 15000) ;
                 
              });
              rest.on('error', function (err) {
                  console.log('[post2GroupVideo] request error', err);
                  callback(err);
              });
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