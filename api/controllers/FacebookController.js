/**
 * FacebookController
 *
 * @description :: Server-side logic for managing Facebooks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var process = require("child_process");
var execFile = process.execFile
const https = require('https');
var querystring = require('querystring');
const { spawn } = require('child_process');
const { exec } = require('child_process');
var FB = require('fb');
FB.options({version: 'v2.11'});



module.exports = {
	post2Group: function(req, res) {
	    var groupId = req.query.groupId;
	    var message = req.query.message;
	    var c_user =  req.query.c_user;
	    var xs =  req.query.xs;
	    var fr =  req.query.fr;
	    var datr =  req.query.datr;
	    var __dyn = req.query.__dyn;
	    var fb_dtsg = req.query.fb_dtsg;
	    var jazoest = req.query.jazoest;
	   
	  
      var urlParameters = 
                "composer_entry_time=7"+
                "&composer_session_id=de9f2c9a-8d7e-4bc4-87bd-6c988817e04d"+
                "&composer_session_duration=2774"+
                "&composer_source_surface=group"+
                "&hide_object_attachment=false"+
                "&num_keystrokes=16"+
                "&num_pastes=0"+
                "&privacyx&ref=group"+
                "&xc_sticker_id=0"+
                "&target_type=group"+
                "&xhpc_message="+  encodeURI(message)  +
                "&xhpc_message_text="+ encodeURI(message)  +
                "&is_react=true"+
                "&xhpc_composerid=rc.u_jsonp_4_r"+
                "&xhpc_targetid=" + groupId +
                "&xhpc_context=profile"+
                "&xhpc_timeline=false"+
                "&xhpc_finch=false"+
                "&xhpc_aggregated_story_composer=false"+
                "&xhpc_publish_type=1"+
                "&xhpc_fundraiser_page=false"+
                "&__user=" + c_user +
                "&__a=1"+
                "&__dyn="+ __dyn + 
                "&__req=49"+
                "&__be=1"+
                "&__pc=EXP1%3Ahome_page_pkg"+
                "&__rev=3453879"+
                "&fb_dtsg="+ fb_dtsg + 
                "&jazoest="+ jazoest + 
                "&__spin_r=3453879"+
                "&__spin_b=trunk"+
                "&__spin_t=1510641759";
	    
	    var options = { 
            hostname: 'www.facebook.com',
            path: "/ajax/updatestatus.php?av=" + req.c_user +  "&dpr=1",
            method: 'POST',
            headers: {'Cookie': 'c_user=' + c_user + ";xs=" + xs + ";fr=" + fr + ";datr=" + datr,
                      'Content-Type': 'application/x-www-form-urlencoded',
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
               // console.log('end' + data);
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
      
      request.write(urlParameters);
      request.end();
      return res.json({ message : 'ok' });
    },
    
  post2GroupVideo: function(req, res) {
	    var groupId = req.query.groupId;
	    var message = req.query.message;
	    var c_user =  req.query.c_user;
	    var xs =  req.query.xs;
	    var fr =  req.query.fr;
	    var datr =  req.query.datr;
	    var __dyn = req.query.jazoest;
	    var fb_dtsg = req.query.fb_dtsg;
	    var jazoest = req.query.jazoest;
	    var videoId = req.query.videoId;
	    
	   
	  
      var urlParameters = 
                "composer_entry_time=7"+
                "&composer_session_id=de9f2c9a-8d7e-4bc4-87bd-6c988817e04d"+
                "&composer_session_duration=2774"+
                "&composer_source_surface=group"+
                "&hide_object_attachment=false"+
                "&num_keystrokes=16"+
                "&num_pastes=0"+
                "&privacyx&ref=group"+
                "&xc_sticker_id=0"+
                "&target_type=group"+
                "&xhpc_message="+  encodeURI(message)  +
                "&xhpc_message_text="+ encodeURI(message)  +
                "&is_react=true"+
                "&xhpc_composerid=rc.u_jsonp_4_r"+
                "&xhpc_targetid=" + groupId +
                "&xhpc_context=profile"+
                "&xhpc_timeline=false"+
                "&xhpc_finch=false"+
                "&xhpc_aggregated_story_composer=false"+
                "&xhpc_publish_type=1"+
                "&xhpc_fundraiser_page=false"+
                "&__user=" + c_user +
                "&__a=1"+
                "&__dyn="+ __dyn + 
                "&__req=49"+
                "&__be=1"+
                "&__pc=EXP1%3Ahome_page_pkg"+
                "&__rev=3453879"+
                "&fb_dtsg="+ fb_dtsg + 
                "&jazoest="+ jazoest + 
                "&__spin_r=3453879"+
                "&__spin_b=trunk"+
                "&__spin_t=1510641759"+
                "&attachment[type]=11"+
                "&attachment[params][0]=" + videoId +
                "&attachment[reshare_original_post]=false"+
                "&xc_share_params=[" + videoId + "]" +
                "&xc_share_target_type=11"
	    
	    var options = { 
            hostname: 'www.facebook.com',
            path: "/ajax/updatestatus.php?av=" + req.c_user +  "&dpr=1",
            method: 'POST',
            headers: {'Cookie': 'c_user=' + c_user + ";xs=" + xs + ";fr=" + fr + ";datr=" + datr,
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
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
               // console.log('end' + data);
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
      
      request.write(urlParameters);
      request.end();
      return res.json({ message : 'ok' });
    },
    
  addAccountFb2DB : function(req, res){
    var accounts = req.body.account;
    var hashtag = req.body.hashtag;
    var arrayOfLines = accounts.split(/\r?\n/);
    console.log(arrayOfLines);
    //var password = req.query.password;
    
    for (var i = 0; i < arrayOfLines.length; i++) {
      var account = arrayOfLines[i].split('|');
      var username = account[0];
      var password = account[1];
      console.log('[addAccountFb2DB] username : ' + username + ', password: ' + password);
      exec('phantomjs ' +__dirname + "/fbGetCookie.js " + username + " " +  password + " " + hashtag, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
    
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
      
    }
    
  
		 return res.json({ message : "ok" });
    
  },
  
  getListGroup : function(req, res){
    var c_user = req.query.c_user;
    var xs =  req.query.xs;
	  var fr =  req.query.fr;
	  var datr =  req.query.datr;
    var options = { 
          hostname: 'www.facebook.com',
          path: "/bookmarks/groups",
          method: 'GET',
          headers: {'Cookie': 'c_user=' + c_user + ";xs=" + xs + ";fr=" + fr + ";datr=" + datr,
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
                
                
                console.log(matches);
                 return res.json({ data : arrGroupId });
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
    });
    
    request.end();
   
    
  },
  
  getStreamVideo : function(req, res){
    var streamVideoId = req.query.streamVideoId;
    var c_user =  req.query.c_user;
    var xs =  req.query.xs;
    var fr =  req.query.fr;
    var datr =  req.query.datr;
    var __dyn = req.query.__dyn;
    
    var path = "/video/liveviewcount/?video_id=" + streamVideoId + 
    "&source=permalink&player_origin=permalink&unmuted=true&dpr=1&__user="+ c_user + 
    "&__a=1&__dyn=" + __dyn +
    "&__req=1f&__be=1&__pc=PHASED%3ADEFAULT&__rev=3461582&__spin_r=3461582&__spin_b=trunk&__spin_t=1510864180"
    
    var options = { 
            hostname: 'www.facebook.com',
            path: path,
            method: 'GET',
            headers: {'Cookie': 'c_user=' + c_user + ";xs=" + xs + ";fr=" + fr + ";datr=" + datr,
                      'Content-Type': 'application/x-javascript; charset=utf-8',
                      'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
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
                console.log('end' + data);
                var regexp = /span/g;
                var match = regexp.exec(data);
                if(match){
                     return res.json({ live : 'true' });
                } else return res.json({ live : 'false' });
                
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
      
      request.end();
      //return res.json({ message : 'ok' });
    
  },
  
  getGroupShares: function(req, res){
    var videoId = req.query.videoId;
    var token = '';
    async.waterfall([
      function(callback){
         Settings.findOne({
            key : 'access_token'
          }).exec(function (err, finn){
            if (!err && finn ) {
                token = finn.value;
            }
            callback()
        });
      },
      function(callback){
         FB.setAccessToken(token);
          FB.api(
          "/" + videoId + "/sharedposts",
          function (response) {
                if (response && !response.error) {
                   return res.json({ data : response });
                } else return res.json({ message : "fail" });
              }
          );
      }
    ], function (error, success) {
      
    });
    
    
    
  },
  
  testFunc : function(req, res){
    var token = '';
    async.waterfall([
      function(callback){
         Settings.findOne({
            key : 'access_token'
          }).exec(function (err, finn){
            if (!err && finn ) {
                token = finn.value;
               console.log('[getGroupShares] token:' + token);
              
            }
            callback()
        });
      }
    ], function (error, success) {
         res.json(token);
    });
   
   
    
  }
};

