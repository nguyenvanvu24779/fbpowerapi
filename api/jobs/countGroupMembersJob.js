const https = require('https');
var async = require("async");
const decompress = require('iltorb').decompress;

var countMemberGroups = function () {
    var accountGlobal = {}
    var groups = [];
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
                 Groups.find().then(function(data) {
                     groups = data;
                     cb();
                 });
            },
            function(cb){
                async.eachOfSeries(groups, (item, key, cbEachOfSeries) => {
                        var group = item;
                        var headers = {
                            "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
                            "accept-language" : "en-US,en;q=0.8",
                            "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0",
                            "accept-encoding" : "gzip, deflate, br",
                           // "content-type" : "application/x-www-form-urlencoded",
                            "cookie" : accountGlobal.cookie
                        };
                      
                        var options = {
                           // url: "https://www.facebook.com/groups/membership_criteria_answer/edit/?group_id=2026891637592451&source=gysj&dpr=1",
                            headers: headers,
                            hostname: 'www.facebook.com',
                            path: "/ajax/home/generic.php?dpr=1&ajaxpipe=1&path=%2Fgroups%2F" + group.groupId + "%2Fmembers%2F&__a=1&__req=fetchstream_2&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548965&__spin_r=3548965&__spin_b=trunk&__spin_t=1514366280&__adt=2&ajaxpipe_fetch_stream=1",
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
                                        var strMatch = 'Members\\u003C\\\/a>\\u003Cspan class=\\\"_grt _50f8\\\">';
                                      
                                        var bIndex = strContent.indexOf(strMatch);
                                        var strContent = strContent.substring(bIndex + strMatch.length);
                                        var eIndex =  strContent.indexOf('\\u003C\\\/span>');
                                        console.log('groupName:  ' + group.name + ',groupMember : ' + strContent.substring(0, eIndex));
                                        var countMembers =  (strContent.substring(0, eIndex)).replace(',' , '');
                                        Groups.update({groupId: group.groupId },{ countMembers : countMembers  }).exec(function afterwards(err, updated){})
                                        
                                    });
                                }
                                cbEachOfSeries()
                            });
                    }).on("error", (err) => {
                        //  console.log("Error: " + err.message);;
                        cbEachOfSeries()
                    });
              
                    request.end();
                }, err => {
                    cb();
                })
            }
    ], err => {
        
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
            sails.log.info("Agenda job : countGroupMembersJob");
            countMemberGroups();
            done();
        },
    };
    return job;
}