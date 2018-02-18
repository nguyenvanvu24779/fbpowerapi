const https = require('https');
var async = require("async");
var md5 = require('md5');
const decompress = require('iltorb').decompress;
var Client = require('node-rest-client').Client;
var client = new Client();


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

var genFullInfoFromCooike = function(cookie, openode , callback){
    
    var url = `http://${openode.siteUrl}/genFullInfoFromCooike?cookie=${cookie}&userAgent=${sails.config.globals.userAgent}`;
    var rest = client.get(encodeURI(url),function (data, response) {
       // console.log(data.data)
       if(data.err){
          return callback(null, {fb_dtsg : '', jazoest : ''})
       }
        if(data.data){
            const buffer = new Buffer(data.data);
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
        } else callback('null');
       
                
    });
    rest.on('error', function (err) {
      console.log('[genFullInfoFromCooike] request error', err);
      callback(err);
    });
   
  
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
                var openode = {siteUrl : 'sharefacebook001.fr.openode.io'};
                
                genFullInfoFromCooike(account_global.cookie,openode ,function(err, data){
                    if(err) 
                        console.log(err)
                    else{
                        fb_dtsg = data.fb_dtsg;
                        jazoest = data.jazoest;
                        
                        account_global.fb_dtsg = fb_dtsg;
                        account_global.jazoest = jazoest;
                        
                        Settings.update({key : 'account_global'},{ value :  JSON.stringify(account_global) }).exec(function afterwards(err, updated){});
                        console.log('[loadFullInfoAccountJob] account_global');
                        
                    }
                });
             }
        }
                    
    });
    AccountsFB.find().populate('openode').then(function(accounts) {
        async.eachOfSeries(accounts, (item, key, callback) => {
            var account = item;
            if(account.__user && account.openode){
                var fb_dtsg = '';
                var jazoest = '';
                
                genFullInfoFromCooike(account.cookie, account.openode ,function(err, data){
                    if(err) 
                        console.log(err)
                    else{
                        fb_dtsg = data.fb_dtsg;
                        jazoest = data.jazoest;
                        
                        if(fb_dtsg.length < 10){
                             AccountsFB.update({__user:  account.__user},{ status : 'checkpoint' }).exec(function afterwards(err, updated){});
                        }  else AccountsFB.update({__user:  account.__user},{ fb_dtsg :  fb_dtsg ,jazoest : jazoest, status : 'OK' }).exec(function afterwards(err, updated){});
                    
                        
                       
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