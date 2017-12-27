var async = require("async");

var loadAccounts = function(callback){
    
}
var loadGroups = function(callback){
    
}
var checkAccount = function(account , callback){
    return callback()
}
var post2GroupVideo = function(groupId, message, account ,callback){
    
}
var shareLiveStream2GroupsJob = function(callback){
    var groups = [];
    var accounts = [];
    async.waterfall([
        function(callbackWaterfall){
            loadGroups(function(err, gr){
                if(err) 
                    return callbackWaterfall(err);
                groups = gr;
                callbackWaterfall();
            })
        },
        function(callbackWaterfall){
             loadAccounts(function(err, data){
                if(err) return callbackWaterfall(err);
                accounts = data;
                callbackWaterfall();
             });
        },
        function(callbackWaterfall){
            async.eachOfSeries(accounts, (item, key, cbEachOfSeries) => {
                var account = item;
                for (var i = 0; i < 3; i++) {
                    if(groups[key*3 + i])
                        post2GroupVideo(groups[key*3 + i], "test message share to groups", account, function(err){
                            
                        });
                }
                cbEachOfSeries();
               
            }, err =>{
                
            })
        }
    ], err => {
            
    });
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'shareLiveStream2GroupsJob',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        //frequency: 'every 60 minutes',

        // Jobs options
        options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            priority: 'highest'
        },

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            sails.log.info("Agenda job : shareLiveStream2GroupsJob");
            sails.log.info("Agenda job : shareLiveStream2GroupsJob, attr Data: ", job.attrs.data);
            done();
        },
    };
    return job;
}