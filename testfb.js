
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
    "cookie" :  'js_ver=2915; sb=XFI4WicDLF6kj7Eb_CDInbhR; pl=n; datr=XFI4WphtYr9VSg-ISKJzYRQI; x-referer=eyJyIjoiLz9zb2Z0PW1lc3NhZ2VzIiwiaCI6Ii8%2Fc29mdD1tZXNzYWdlcyIsInMiOiJtIn0%3D; m_pixel_ratio=1; c_user=100003547953606; xs=5%3Axvnk4qH_br2tLg%3A2%3A1514232392%3A4035%3A6192; fr=09jOnUwjhCXUdAKUI.AWWcBVG--GrRRlsqgZx1wvHr9_s.BaOFJc.1l.FpB.0.0.BaQ2Md.AWWSJ5Io; presence=EDvF3EtimeF1514366299EuserFA21B03547953606A2EstateFDt3F_5bDiFA2user_3a1B08299874952A2ErF1EoF1EfF1C_5dEutc3F1514366231653G514366299775CEchFDp_5f1B03547953606F7CC; wd=1299x270; act=1514366304260%2F2; pnl_data2=eyJhIjoib25hZnRlcmxvYWQiLCJjIjoiL2dyb3Vwcy9wcm9maWxlLnBocDptZW1iZXJzIiwiYiI6ZmFsc2UsImQiOiIvZ3JvdXBzLzY0MzI2MjE0MjQ4MDU3Ni9tZW1iZXJzLyIsImUiOltdfQ%3D%3D'
  };
  
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
                   // console.log(strContent);
                    var strMatch = 'Members\\u003C\\\/a>\\u003Cspan class=\\\"_grt _50f8\\\">';
                  
                    var bIndex = strContent.indexOf(strMatch);
                    var strContent = strContent.substring(bIndex + strMatch.length);
                    var eIndex =  strContent.indexOf('\\u003C\\\/span>');
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

//genCookieFromAccount("zexop@tinoza.org", "Haiyen2202")
//countMemberGroup()
  //getListGroup()
       


//loadAccessTokenAccounts();

//testJoin2Group();


//testJoin2GroupAnswer();
