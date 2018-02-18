var async = require("async");
const decompress = require('iltorb').decompress;
const https = require('https');
const { URL } = require('url');

function diff_minutes(dt2, dt1) 
{

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
}

var getLiveStreamFromFanpage = function(cookie, fanpageName, callback){
  var headers = {
   // "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.9",
    "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" : cookie     
  };
  
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/" + fanpageName + "/videos/",
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
                var videoId = '';
                if( encoding == 'br'){  
                  decompress(buffer, function(err, output) {
                    //(err, );
                    var strContent = '';
                    if(output){ 
                        strContent =   output.toString();
                        //console.log(strContent)
                        if(strContent.includes('Now Live')){
                            var index = strContent.indexOf('Now Live');
                            strContent = strContent.substring(index);
                            index = strContent.indexOf('\/videos\/');
                            strContent = strContent.substring(index + 8, index + 8 + 16);
                            if(!isNaN(strContent)){
                                console.log(strContent);
                                videoId =  strContent;
                            }
                        
                        }
                    }
                    callback(null, videoId);
                  });
                }
              });
         
        }).on("error", (err) => {
            callback(err);
          console.log("Error: " + err.message);
    });
    request.end();
}


var getLiveStreamFromProfile = function(cookie, profileId, callback){
  var headers = {
   // "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.9",
    "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" :  cookie
    };
  
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/" + profileId  + "/videos_by",
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
                var videoId = '';
                if( encoding == 'br'){  
                  decompress(buffer, function(err, output) {
                    //(err, );
                    var strContent = '';
                    if(output){ 
                      strContent =   output.toString();
                      if(strContent.includes('Now Live')){
                        var index = strContent.indexOf('\/videos/vb.');
                        strContent = strContent.substring(index + 11);
                        index = strContent.indexOf('\/');
                        strContent = strContent.substring(index + 1);
                        videoId = strContent.substring(0,  strContent.indexOf('\/'));
                        console.log(videoId)
                        
                      }
                    }
                    callback(null, videoId);
                    
                  });
                }
               
              });
         
        }).on("error", (err) => {
            callback(err);
          console.log("Error: " + err.message);
    });
    request.end();
}


var getTypeUrl = function(name, cookie, callback){
  var headers = {
   // "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.9",
    "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" :  cookie
  };
  
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/"+ name,
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
                    if(err) return callback(err);
                    var strContent = '';
                    if(output){ 
                      strContent =   output.toString();
                      //console.log(strContent)
                      if(strContent.includes('\"text\":\"Create Page\"')){
                        console.log('isPage');
                        return callback(null, 'Page')
                      } else if(strContent.includes('https:\/\/www.facebook.com\/' + name + '\/friends')){
                        console.log('isProfile');
                        return callback(null,'Profile');
                      }
                    }
                    return callback('error');
                  });
                }
              });
         
        }).on("error", (err) => {
            callback(err)
          console.log("Error: " + err.message);
    });
    request.end();
}

var getLiveStreamFromUrl =  function(cookie, url, callback){
    if(!url.includes('https://www.facebook.com')){
        return callback('url error');
    }
    var videoId = '';
    if(url.includes('\/videos\/')){
        var index = url.indexOf('\/videos\/');
        videoId =  url.substring(index + 8, index + 8 + 16);
        console.log(videoId);
        return callback(null, videoId);
    }
    else if(url.includes('profile.php?id=')){
        var profileId = '';
        var index  = url.indexOf('profile.php?id=');
        profileId =  url.substring(index + 15, index + 15 + 15);
        getLiveStreamFromProfile(cookie, profileId, function(err, videoId) {
            if(err) return callback(err);
            return callback(null, videoId);
        } );
    } else {
        var index  = url.indexOf('facebook.com\/');
        var name = url.substring(index + 13);
        name =  name.replace(/\//g, "");
        getTypeUrl(name,cookie, function(err, type ){
            if(type == 'Profile'){
                getLiveStreamFromProfile(cookie, name, function(err, videoId) {
                    if(err) return callback(err);
                    return callback(null, videoId);
                });
            } else if(type == 'Page'){
                getLiveStreamFromFanpage(cookie, name, function(err, videoId){
                    if(err) return callback(err);
                    return callback(null, videoId);
                })
            } else callback('error url');
        })
    }
}

var checkOrderStreamVideoJob = function(callback){
    var account_global = {}
    async.waterfall([
        function(cb){
                Settings.findOne({
                    key : 'account_global'
                  }).exec(function (err, finn){
                    if (!err && finn ) {
                        account_global = JSON.parse(finn.value);
                    }
                    cb()
                });  
        },
        function(cb){
            StreamVideo.find().exec(function(err, orders){
                if(err) return callback(err);
                async.eachOfSeries(orders, (item,key,cbEachOfSeries) => {
                    if(item.status != 'Init'){
                        return cbEachOfSeries();
                    }
                    //const myURL = new URL(item.url);
                    //var profileId = myURL.pathname.replace(/\//g,'' )
                    getLiveStreamFromUrl(account_global.cookie, item.url , function(err, videoId){
                        if(err) {
                            return cbEachOfSeries();
                        }
                        if(videoId.length > 0 && !isNaN(parseInt(videoId)) ){
                            console.log('Start Share Stream...')
                            Jobs.now('shareLiveStream2GroupsJob', { videoId : videoId , streamVideoId : item.id, timeShareLimit : item.timeShareLimit})
                            StreamVideo.update({id: item.id },{ status : 'Processing' , videoId : videoId }).exec(function afterwards(err, updated){})
                        } else {
                            if(diff_minutes(new Date(item.createdAt), new Date()) > 15){
                                StreamVideo.update({id: item.id },{ status : 'Cancel', error_msg : 'stream not found'  }).exec(function afterwards(err, updated){})
                                ShareDetail.update({streamvideo : item.id },{ status : 'Cancel', error_msg : 'stream not found'  }).exec(function afterwards(err, updated){})
                            }
                        }
                        cbEachOfSeries();
                    })
                   
                       
                }, err =>{
                    cb();
                })
                
            });
        }
    ], err => {
        callback();
    });
    
    
}

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'checkOrderStreamVideoJob',

        // set true to disabled this job
        //disabled: true,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 20 seconds',

        // Jobs options
        options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            priority: 'highest'
        },

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
           // sails.log.info("Agenda job : checkOrderStreamVideoJob");
            checkOrderStreamVideoJob(function(err){
                 done();
            });
           
        },
    };
    return job;
}