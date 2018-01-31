/**
 * ScheduleJobController
 *
 * @description :: Server-side logic for managing Schedulejobs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 const https = require('https');

module.exports = {
	loadGroupsAccount : function(req, res) {
	    AccountsFB.find().then(function(accounts) {
          for (var i = 0; i < accounts.length; i++) {
              var account = accounts[i];
              if(account.__user == undefined || account.__user == null)   continue;
                var options = { 
                      hostname: 'www.facebook.com',
                      path: "/bookmarks/groups",
                      method: 'GET',
                      headers: {'Cookie':  account.cookie ,
                                //'Content-Type': 'application/x-www-form-urlencoded',
                                'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
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
                            //console.log(arrGroupId)
                            AccountsFB.update({__user: account.__user},{ groups:arrGroupId }).exec(function afterwards(err, updated){
                                  if (err) {
                                    // handle error here- e.g. `res.serverError(err);`
                                    console.log(err);
                                    return;
                                  }
                                  console.log('Updated user to have name ' + updated[0].username);
                                });
                            });
                     
                    }).on("error", (err) => {
                      console.log("Error: " + err.message);
                });
                request.end();
          }
        }).catch(function(err){
          //....
        });
        res.json({message : 'ok'});
	},
	
	refreshJob : function(req, res){
	  var jobName = req.query.jobName;
	  if(jobName) Jobs.now(jobName, {})
	  return res.json({message : 'ok'})
	},
	
	test: function(req, res){
	    ScheduleJob.find({name :'joinAccounts2Groups',  nextRunAt: { $not : { $type : 10 } ,  $exists : true } }).exec(function(err, data){
                    	    var now = new Date();
                    	    var nextRunAt = new Date(data[0].nextRunAt);
                    	    if( now.getTime() >= nextRunAt.getTime() ){
                    	        console.log('nextRunAt:' + data.nextRunAt);
                    	       // return callbackGroups('nextRunAt:' + data.nextRunAt)
                    	    }
                    	    
                    	    //console.log(data[0].nextRunAt)
	    });
	      return res.json({message : 'ok'})
	}
};

