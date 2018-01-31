const https = require('https');
var async = require("async");
const decompress = require('iltorb').decompress;

var countMemberGroups = function (cbG) {
    var accountGlobal = {}
    var groups = [];
    var groupMemberRequire = 10000;
    async.waterfall([
            function(cb){
                Settings.findOne({
                    key : 'account_global'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        accountGlobal = JSON.parse(finn.value);
                    }
                    cb()
                });  
            },
            function(cb){
                Settings.findOne({
                    key : 'groupMemberRequire'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        groupMemberRequire = parseInt(finn.value) > 10000 ? 10000 : parseInt(finn.value) ;
                    }
                    cb()
                });  
            },
            function(cb){
                 Groups.find().then(function(data) {
                     groups = data;
                     cb();
                 });
            },
            function(cb){
                async.eachOfSeries(groups, (item, key, cbEachOfSeries) => {
                        var group = item;
                        if(group.countMembers && group.countMembers >= groupMemberRequire ){
                            return cbEachOfSeries();
                        }
                        var headers = {
                          //  "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
                            "accept-language" : "en-US,en;q=0.9",
                            "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                            "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
                            "accept-encoding" : "gzip, deflate, br",
                           // "content-type" : "application/x-www-form-urlencoded",
                            "cookie" : accountGlobal.cookie
                        };
                      
                        var options = {
                            headers: headers,
                            hostname: 'www.facebook.com',
                            path: '/groups/' + group.groupId + '/members/', //"/ajax/home/generic.php?dpr=1&ajaxpipe=1&path=%2Fgroups%2F" + group.groupId + "%2Fmembers%2F&__a=1&__req=fetchstream_2&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548965&__spin_r=3548965&__spin_b=trunk&__spin_t=1514366280&__adt=2&ajaxpipe_fetch_stream=1",
                            method: 'GET',
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
                                      //(err, );
                                      var strContent = '';
                                        if(output) strContent =   output.toString()
                                       // console.log(strContent);
                                       var strMatch = '<span class=\"_grt _50f8\">';
                                      
                                        var bIndex = strContent.indexOf(strMatch);
                                        //console.log(bIndex);
                                        var strContent = strContent.substring(bIndex + strMatch.length);
                                        var eIndex =  strContent.indexOf('<\/span>');
                                        console.log('groupName:  ' + group.name + ',groupMember : ' + strContent.substring(0, eIndex));
                                        var countMembers =  (strContent.substring(0, eIndex)).replace(',' , '');
                                        if(isNaN( parseInt(countMembers)) != true &&  parseInt(countMembers) < groupMemberRequire){
                                            Groups.destroy({id : group.id}).exec(function(err){
                                                if(err)
                                                    console.log('delete groupName: ' + group.name +', err', err);
                                                else console.log('delete groupName: ' + group.name);
                                            })
                                        } else if(isNaN( parseInt(countMembers)) != true){
                                            Groups.update({groupId: group.groupId },{ countMembers : parseInt(countMembers)  }).exec(function afterwards(err, updated){})
                                        }
                                    });
                                }
                                setTimeout(function(){ cbEachOfSeries()},5000); 
                            });
                    }).on("error", (err) => {
                        //  console.log("Error: " + err.message);;
                        setTimeout(function(){ cbEachOfSeries()},5000); 
                    });
              
                    request.end();
                }, err => {
                    cb();
                })
            }
    ], err => {
        cbG();
    })
   
   
}
module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'countGroupMembersJob',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 1440 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : countGroupMembersJob");
            countMemberGroups(function(){
                done();
            });
            
        },
    };
    return job;
}