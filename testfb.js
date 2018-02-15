
const https = require('https');
const http = require('http');
var md5 = require('md5');
var async = require("async");
const decompress = require('iltorb').decompress;
var FB = require('fb');
var pager = require('sails-pager');
FB.options({version: 'v2.11'});

var testJoin2Group =  function() {
    
    var cookie = 'datr=2_g-WkA4vmRNTyjdby_n7RaT; locale=vi_VN; sb=2_g-WjmuDxr9D9iVyUT_zqLS; c_user=100016951698809; xs=39%3AjIbcEk5ihichUg%3A2%3A1514077429%3A10377%3A6267; fr=09B4gaJ6nuuDuGptY.AWWgoh7wGkZEhTfuV8XStRIZA0w.BaPvjb.tR.AAA.0.0.BaPvz1.AWVcO8m-; pl=n; presence=EDvF3EtimeF1514077867EuserFA21B16951698809A2EstateFDutF1514077867624CEchFDp_5f1B16951698809F19CC; wd=1301x298; act=1514077874924%2F0; pnl_data2=eyJhIjoib25hZnRlcmxvYWQiLCJjIjoiL2dyb3Vwcy9wcm9maWxlLnBocDpmZWVkIiwiYiI6ZmFsc2UsImQiOiIvZ3JvdXBzLzE1NDcxODQ5Mzg2NTg1MTUvIiwiZSI6W119';
    var params = "ref=group_jump_header&group_id=1547184938658515&client_custom_questions=1&__user=100016951698809&__a=1&__dyn=7AgNe-4am2d2u6aJGeFxqewKKEKEW8x2C-C267UqwWhE98nwgU6C7WUC3eEbbyEjKewhA3uczobohwAwIUsz8nwvp8S2m4o9Ef8oC-3S7WwaWu7oeoa898pCK6oc8rwr8-367Uy5UG1By8SexeEgy86O8HgoUGq9wyXAx-lwhoC4EC&__req=q&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548041&fb_dtsg=AQFEkqRy5NJ8%3AAQFBlteLb7rD&jazoest=2658170691071138212153787456586581706610811610176985511468&__spin_r=3548041&__spin_b=trunk&__spin_t=1514077825";
    
    var options = { 
                hostname: 'www.facebook.com',
                path: "/ajax/groups/membership/r2j.php?dpr=1",
                method: 'POST',
                headers: {'Cookie':  cookie,
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
    
    request.write(params);
    request.end();
}

var testJoin2GroupAnswer = function (){
    var cookie = 'datr=2_g-WkA4vmRNTyjdby_n7RaT; locale=vi_VN; sb=2_g-WjmuDxr9D9iVyUT_zqLS; c_user=100016951698809; xs=39%3AjIbcEk5ihichUg%3A2%3A1514077429%3A10377%3A6267; fr=09B4gaJ6nuuDuGptY.AWWgoh7wGkZEhTfuV8XStRIZA0w.BaPvjb.tR.AAA.0.0.BaPvz1.AWVcO8m-; pl=n; presence=EDvF3EtimeF1514077653EuserFA21B16951698809A2EstateFDutF1514077653626CEchFDp_5f1B16951698809F12CC; wd=1301x298; act=1514077683345%2F5';
    var params = "fb_dtsg=AQFZTGbOSHOF%3AAQF_iBsjBNrz&questionnaire_answers[0]=aaaa&questionnaire_answers[1]=bbbb&questionnaire_answers[2]=cccc&__user=100016951698809&__a=1&__dyn=7AgNe-4am2d2u6aJGeFxqewKKEKEW8x2C-C267UqwWhE98nwgU6C7WUC3eEbbyEjKewhA3uczobohwAwIUsz8nwvp8S2m4o9Ef8oC-3S7WwaWu7oeoa898pCK6oc8rwr8-367Uy5UG1By8SexeEgy86O8HgoUGq9wyXAx-lwhoC4EC&__req=12&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548041&jazoest=26581709084719879837279705865817095105661151066678114122&__spin_r=3548041&__spin_b=trunk&__spin_t=1514077582";
    
    var customQuestions = 'custom_questions[0]=Lí do bạn tham gia group ?' 
    + '&custom_questions[1]=Bạn ở thuộc tỉnh nào việt nam'
    + '&custom_questions[2]=Bạn biết groups từ đâu ?';
    var options = { 
                hostname: 'www.facebook.com',
                path: "/groups/membership_criteria_answer/save/?group_id=1547184938658515&dpr=1&" +   encodeURI(customQuestions),
                method: 'POST',
                headers: {'Cookie':  cookie,
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
    
    request.write(params);
    request.end();
    
} 


var loadAccessTokenAccounts = function(){

  var account = {"username":"zexop@tinoza.org","password":"Haiyen2202","__dyn":"7AgNe-4amaxx2u6Xolg9pE9XG8GEW8xdLFwxx-6ES2N6wAxu13wqovHyorxuEbbxWU4St0gKum2S4ogUCu5omxWcwJwQwOxa2m4o9Ef8oC-3S7WwQwJwiVVonwVCwobGUogoxu6Uao4afwNx-8xuazodoaESexq488o4e6aUpUGq9wyQF8mDg9EqBAgC78C","__spin_r":"3548493","__spin_t":"1514211516","__user":"100016951698809","fb_dtsg":"AQHEORIHLO_f:AQEr5jxgquPc","jazoest":"2658172697982737276799510258658169114531061201031131178099","cookie":";datr=tghBWlE9cBZ7Tj84lzPhI3JD;fr=0ALzU5uAL4zgf0DRz.AWUhRBn3K-We5M7NSUg6cR9rO64.BaQQi2.Lm.AAA.0.0.BaQQi7.AWVsHLIj;xs=43:-XhRaYv16VKnJA:2:1514211515:10377:6267;c_user=100016951698809","hashtag":"undefined","createdAt":"2017-12-25T14:18:42.725Z","updatedAt":"2017-12-25T14:18:42.725Z","id":"5a4108c264d5af411ba8ee5f"}
      var sig = "api_key=882a8490361da98702bf97a021ddc14d" 
      +"generate_session_cookies=1"
      +"email=" + account.username
      +"format=JSONlocale=vi_vnmethod=auth.loginpassword="+ account.password
      +"return_ssl_resources=0v=1.062f8ce9f74b12f84c123cc23437a4a32";
      
      var urlParam = "api_key=882a8490361da98702bf97a021ddc14d"
      +"&generate_session_cookies=1"
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
                    'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
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
              console.log('access_token : ' , (JSON.parse(data)) );
            });
       
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
      request.end();
}


var requestWithEncoding = function(groupsId, user, callback) {
    
    var headers = {
      "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
      "accept-language" : "en-US,en;q=0.8",
      "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0",
      "accept-encoding" : "gzip, deflate, br",
      "content-type" : "application/x-www-form-urlencoded",
      "cookie" :  user.cookie
    };

    var options = {
       // url: "https://www.facebook.com/groups/membership_criteria_answer/edit/?group_id=2026891637592451&source=gysj&dpr=1",
        headers: headers,
        hostname: 'www.facebook.com',
        path: "/groups/membership_criteria_answer/edit/?group_id=" + groupsId +  "&source=gysj&dpr=1",
        method: 'POST',
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
                  callback(err, output && output.toString());
                });
                
            } else {
                callback(null, buffer.toString());
          }
        });
    }).on("error", (err) => {
          console.log("Error: " + err.message);;
    });
  
   request.write("group_id=" + groupsId + 
       +"&source=gysj&__asyncDialog=2"
       +"&__user=" + user.__user 
       +"&__a=1"
       +"&__dyn=" + user.__dyn  
       +"&__req=4o&__be=1&__pc=PHASED%3ADEFAULT&__rev=3492490"
       +"&fb_dtsg=" + user.fb_dtsg
       +"&jazoest=" + user.jazoest
       +"&__spin_r=3492490&__spin_b=trunk&__spin_t=1512112658");
   request.end();
}




var user = {"username":"fefugefe@ether123.net","password":"Haiyen2202",
"__dyn":"7AgNe-4amaxx2u6Xolg9pE9XG8GEW8xdLFwxx-6ES2N6wAxu13wqovHyodEbbxWU5l0h9VobohwAwIxWcwJwpUiwBx62q3O69LwZx-E6a1bDBxu3C1DCK6468nxK1IzUcovy8nyES3m2GdzEmx22613xyK6uaCyo8Jai7A11BAgC78",
"__spin_r":"3548898","__spin_t":"1514338162",
"__user":"100022938891873",
"fb_dtsg":"AQHjvYbTcql4:AQGwKQ2oP1Ur",
"jazoest":"2	2658172106118899884991131085258658171119758150111804985114",
"cookie":"",
"hashtag":"undefined","createdAt":"2017-12-27T01:29:25.675Z","updatedAt":"2017-12-27T01:29:25.675Z","id":"5a42f7752b769f5a0c9cfe5c"}

/*
requestWithEncoding('748487905348786', user, function(err, data){
   if(err) return console.log(err);
   console.log(data);
  
})

*/



 
var  getListGroup  = function(){
    var options = { 
          hostname: 'www.facebook.com',
          path: "/bookmarks/groups",
          method: 'GET',
          headers: {'Cookie': user.cookie, 
                    //'Content-Type': 'application/x-www-form-urlencoded',
                    'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
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
                
                
                console.log(data);
                
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
    });
    
    request.end();
   
    
}

var countMemberGroup = function () {
  
  var headers = {
    "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.8",
    "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0",
    "accept-encoding" : "gzip, deflate, br",
    "content-type" : "application/x-www-form-urlencoded",
    "cookie" :  'atr=WTxPWlGiDrmPUYqGnyzTYZuG;c_user=100007412476717;xs=1:0pKez1U-bF1BTw:2:1515142245:14829:6215;fr=0Bn6yvgYQKtwgqaEK.AWUcMGwp3ZhIj5_PCRxK7vZzISM.BaTzxZ.M8.AAA.0.0.BaTzxl.AWWiUVix;'
  }
  
  var options = {
       // url: "https://www.facebook.com/groups/membership_criteria_answer/edit/?group_id=2026891637592451&source=gysj&dpr=1",
        headers: headers,
        hostname: 'www.facebook.com',
        path: "/ajax/home/generic.php?dpr=1&ajaxpipe=1&path=%2Fgroups%2F692918860833719%2Fmembers%2F&__a=1&__req=fetchstream_2&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548965&__spin_r=3548965&__spin_b=trunk&__spin_t=1514366280&__adt=2&ajaxpipe_fetch_stream=1",
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
                   //console.log(strContent);
                    var strMatch = 'class=\\\"_grt _50f8\\\">';
                  
                    var bIndex = strContent.indexOf(strMatch);
                    var strContent = strContent.substring(bIndex + strMatch.length);
                    console.log(strContent);
                    var eIndex =  strContent.indexOf('\\u003C\\/span>');
                    console.log('groupMember : ' + strContent.substring(0, eIndex))
                    
                    
                });
                
            } else {
               // callback(null, buffer.toString());
             //console.log(buffer && buffer.toString())
          }
        });
    }).on("error", (err) => {
        //  console.log("Error: " + err.message);;
    });
  
   request.end();
   
  
}

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
   
var genFullInfoFromCooike = function(cookie){
  var headers = {
    "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.8",
    "accept" : "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" :  cookie
  };
  
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/",
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
                    //(err, );
                    var strContent = '';
                    if(output){ 
                      strContent =   output.toString();
                      var fb_dtsg  = getStrings(strContent , '{"token":"', '"')
                      var jazoest = '';
                      for (var i = 0; i < fb_dtsg.length; i++) jazoest += fb_dtsg.charCodeAt(i);
                      console.log(jazoest);
                      
                    }
                  });
                }
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
    });
    request.end();
  
}

var genCookieFromAccount = function(username , password){
   var options = { 
          hostname: '45.117.169.77',
          path: "/accesstoken/index.php?email=" + username + "&password=" + password,
          method: 'GET',
          headers: {//'Cookie': user.cookie, 
                    //'Content-Type': 'application/x-www-form-urlencoded',
                    'user-agent' : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
          }
    };
     var data = '';
    
    var request =  http.request(options, (resp) => {
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                //console.log('end' + data);
              // console.log(JSON.parse( data));
                var jsonData = JSON.parse(data);
                //console.log(data1)
                if(jsonData.error_code)
                  return console.log('[error_code] error_msg: ',jsonData.error_msg )
                var cookieStr = '';
                for (var i = 0; i < jsonData.session_cookies.length; i++) {
                    cookieStr+= jsonData.session_cookies[i].name + '=' + jsonData.session_cookies[i].value + ';';
                }
                cookieStr = cookieStr.slice(0, -1)
                console.log(cookieStr)
                genFullInfoFromCooike(cookieStr);
                
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
    });
    request.end();
  
}


var getStatusVideo = function(){
   var headers = {
   // "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.9",
    "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" :  "datr=PfgPVtLPN6FahZqftRH08vKi; sb=RMDnV_Cf5qCLsNpFUiFfQ0Xj; c_user=100003547953606; xs=12%3AwoI5UXh_p31PUg%3A2%3A1505392771%3A4035%3A6192; fr=0bjlZrd4hpXNhJ5bE.AWVaxGWl2Ejd68KboK8xUdaBRlc.BZulQb.Rp.Fpa.0.0.BaXFA1.AWWZQ1NO; wd=822x672; act=1516002241560%2F2; presence=EDvF3EtimeF1516002253EuserFA21B03547953606A2EstateFDt3F_5bDiFA2user_3a1B02635509719A2EoF1EfF1C_5dEutc3F1516002243519G516002253377CEchFDp_5f1B03547953606F23CC"
  };
  
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/ChinaGlobalTVNetwork/videos/2091900450850764/",
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
                    //(err, );
                    var strContent = '';
                    if(output){ 
                      strContent =   output.toString();
                      console.log(strContent.includes('<span class=\"_2wrk\">LIVE<\/span>'));
                      
                    }
                  });
                }
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
    });
    request.end();
  
}

var getLiveStreamFromProfile = function(){
  var headers = {
   // "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language" : "en-US,en;q=0.9",
    "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept-encoding" : "gzip, deflate, br",
    "cookie" :  "datr=WTxPWlGiDrmPUYqGnyzTYZuG;c_user=100007412476717;xs=1:0pKez1U-bF1BTw:2:1515142245:14829:6215;fr=0Bn6yvgYQKtwgqaEK.AWUcMGwp3ZhIj5_PCRxK7vZzISM.BaTzxZ.M8.AAA.0.0.BaTzxl.AWWiUVix;"   
  };
  
  
   var options = { 
          hostname: 'www.facebook.com',
          path: "/ervis.likmeta/videos_by",
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
                    //(err, );
                    var strContent = '';
                    if(output){ 
                      strContent =   output.toString();
                      if(strContent.includes('Now Live')){
                        var index = strContent.indexOf('\/videos/vb.');
                        strContent = strContent.substring(index + 11);
                        index = strContent.indexOf('\/');
                        strContent = strContent.substring(index + 1);
                        var videoId = strContent.substring(0,  strContent.indexOf('\/'));
                        console.log(videoId)
                      }
                      //console.log(strContent);
                      
                    }
                  });
                }
              });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
    });
    request.end();
}

var Client = require('node-rest-client').Client;
var client = new Client();

var 	addOpenode = function(){
	   // var siteUrl = req.query.siteUrl;
	    client.get("http://ip-api.com/json", function (data, response) {
            console.log(response);
           
        });
}

var checkShareVideo = function(){
  var fetch = function (value, after ) { 
            var url = ""; 
            if(after != "")  
                url = "/" + value + "/sharedposts?fields=to{profile_type,name},from&limit=1000" + "&after=" + after;
            else url =  "/" + value + "/sharedposts?fields=to{profile_type,name},from&limit=1000";
            
            console.log(url);
            
            FB.api(url, function(response){
                if(response && ! response.error){
                    var data = response.data;
                    async.forEachOf(data, (item, key, callback) => {
                        if(item.to && item.to.data[0].profile_type == "group"){
                            // res.write(JSON.stringify( data[i].to));
                             //sails.sockets.broadcast('root', {msg : 'add group: ' + item.to.data[0].name  });
                             FB.api("/" + item.to.data[0].id , function(response) {
                                if (response && !response.error) {
                                    var group = {};
                                    if(response.name) group.name = response.name;
                                    if(response.privacy) group.privacy =  response.privacy;
                                    if(response.id) group.groupId =  response.id;
                                    group.question = [];
                                }
                             });
                             
                             if(item.to && item.to.data[0].profile_type == 'group'){
                                console.log(JSON.stringify(item.from));
                             }
                            
                        }
                        callback();
                    }, err => {})
                  
                    if(response.paging && response.paging.next) 
                        fetch(value, response.paging.cursors.after);
                    } else {
                        //sails.sockets.broadcast('root', {msg : 'error: ' + JSON.stringify(response.error) });
                        console.log(response.error);
                    }
            });
        }
  FB.setAccessToken('728737413842371|DvTzaYsqojolMadzKC21sWVK0Kk');
  fetch('907678499406026', "");
  
}



var Join2Group =  function(account, groupId) {
    console.log((new Date()).toTimeString() +  ' [Join2Group] account: ' + account.username +', groupId: ' + groupId)
    var cookie = account.cookie;
    var userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
    var url = `http://45.117.169.77:3002/Join2Group?cookie=${account.cookie}&fb_dtsg=${account.fb_dtsg}&jazoest=${account.jazoest}&__user=${account.__user}&groupId=${groupId}&userAgent=${userAgent}`;
    var rest = client.get(encodeURI(url),function (data, response) {
   
    });
    rest.on('error', function (err) {
      console.log('[Join2Group] request error', err);
    });
}

var Join2GroupAnswer = function (account, groupId, question, answers){
    console.log('[Join2GroupAnswer]')
    var cookie = account.cookie; 
    var params = "fb_dtsg=" + account.fb_dtsg;
    
    for (var i = 0; i < answers.length; i++) {
        var answer = answers[i];
        var arrAnswer = answer.split('|');
        var randomItem = arrAnswer[Math.floor(Math.random()*arrAnswer.length)];
        params = params + "&questionnaire_answers["+ i +"]=" +  randomItem;
    }
   
    params = params +"&__user="+ account.__user
    +"&__a=1"
    +"&__dyn=" + account.__dyn
    +"&__req=12&__be=1&__pc=PHASED%3ADEFAULT&__rev=3548041"
    +"&jazoest=" + account.jazoest
    +"&__spin_r=3548041&__spin_b=trunk&__spin_t=1514077582";
    
    var customQuestions = '';
    
    for (var j = 0; j < question.length; j++) {
        customQuestions = customQuestions + '&custom_questions['+ j + ']=' + question[j].replace(/<\/?[^>]+(>|$)/g, "") ;
    }
    const buffParams = Buffer.from(params, 'utf8');
    const buffCustomQuestions = Buffer.from(customQuestions, 'utf8');
    
    var userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
    var url = `http://45.117.169.77:3002/Join2GroupAnswer?cookie=${account.cookie}&params=${buffParams.toString('base64')}&customQuestions=${buffCustomQuestions.toString('base64')}&groupId=${groupId}&userAgent=${userAgent}`;
    var rest = client.get(encodeURI(url),function (data, response) {
   
    });
    rest.on('error', function (err) {
      console.log('[Join2GroupAnswer] request error', err);
    });
    
} 

var account = {"openode":{siteUrl:  'sharefacebook001.fr.openode.io'},"__user":"100011621776007","cookie":"datr=nrxvWqMGhPHRZUwimdrfXw4A;c_user=100011621776007;xs=37:G7E0yzAYygxydA:2:1517272234:12308:6354;fr=0WqkLJRVaxc67uZ8h.AWVi-FgZMi1pTfTFC3LZHBX9jKo.Bab7ye.ro.AAA.0.0.Bab7yq.AWWENs6J;","fb_dtsg":"AQHH6h9lURPn:AQGRH7bO2Bb4","jazoest":"65817272541045710885828011058658171827255987950669852","username":"100011621776007.efzivr@mko.nz","password":"ndtdtk","createdAt":"2018-01-30T00:30:51.827Z","updatedAt":"2018-02-01T06:28:36.619Z","groups":["144189169275056","348041448709467","208276187861706","173561108672097","169427265751371","168017032225338","163573939669803","161536488545363","160465068647205","156915568002994","155614176129689","151538262540450","147591708908854","145789550114463","749147081877251","737679706252665","734811609977800","723097811058166","681701125224813","675677975926989","634700966636394","591137224260826","542670132519281","382415811937320","363740610417167","330457034036326","263687817158129","200481560333243","143050899439829","136370076852271"],"groupsRequest":["348041448709467","1475917089088549","1635739396698036","1441891692750565","1569155680029940","1515382625404506","165172347340792","749147081877251","294654557348817","139892799411252","285925378238637","824358214277896","1431271060449396","382415811937320","1637429786481399","467801819920347","1598133820401243","330457034036326","675677975926989","1735611086720978","730657617026953","1604650686472053","1244263715636998","727218804055316","1556141761296891","1549584811951840","1095857063825973","1680170322253382","319680848365055","723097811058166","1448365185406361","579231898812536","747802028680498","245732399178003","1108002785908381","1457895501144635","1642973999316216","1001037096639231","634700966636394","200481560333243","1027066707392390","870484263003111","542670132519281","569625106758289","656973331048539","1573548492876173","1615364885453636","734811609977800","946553718764372","1404321839597302","363740610417167","1677228882492310","1516457965306532","608584672577255","2082761878617067","1694272657513711","1007004112694183","1632679440315621","393930234117764","1422580434716634","248993088807057","521644061219999"],"status":"OK","id":"5a6fbcbbea4cc7195e124f92"}

var answers = [
    'Vũ nguyễn',
    'zzz|xxx|vvv',
    'hhhh|dfdf|yyy'
  ]
var question = [
  'câu hỏi x ?',
  'câu hỏi y',
  'câu hỏi z ?'
  ] 

Join2Group(account, '748487905348786');

Join2GroupAnswer(account, '748487905348786',question, answers );
//checkShareVideo();
//addOpenode();

//getLiveStreamFromProfile();

//getStatusVideo();
//genCookieFromAccount("zexop@tinoza.org", "Haiyen2202")
//countMemberGroup()
  //getListGroup()
       


//loadAccessTokenAccounts();

//testJoin2Group();


//testJoin2GroupAnswer();
