var http = require('http');
var url = require('url');
var fs = require('fs');
var cookie = require('cookie');

var sessionid = 1;

http.createServer(function(req,res){
	var requrl = url.parse(req.url);
	if(requrl.pathname=='/'){
		res.statusCode = 301;
		res.setHeader('Location','/login.html');
		res.end();
	}else if(requrl.pathname=='/login.html'){
		fs.createReadStream('./login.html').pipe(res);
	}else if(requrl.pathname=='/submit'){
		if(req.method=='POST'){
			var postdata = '';
			req.on('data',function(chunk){
				postdata += chunk;
			});
			req.on('end',function(){
				var pairs = postdata.split('&');
				var kv = {};
				for(var i=0;i<pairs.length;i++){
					var kvs = pairs[i].split('=');
					kv[kvs[0]]=kvs[1];
				}
				var cookies = {};
				if(req.headers.cookie){
					cookies = cookie.parse(req.headers.cookie);
				}
				var cookie_key = 'your_session_id'+kv.user;
				if(cookies[cookie_key]){
					res.end('your session id is:'+cookies[cookie_key]);
				}else{
					if(kv.user && kv.pass){
						sessionid = sessionid + 1;
						var send_cookie =
								cookie.serialize(cookie_key,sessionid);
						res.setHeader('set-cookie',send_cookie);
						res.end('generated new session id:'+sessionid);
					}else{
						res.end('invalid user or pass:'+kv.user+':'+kv.pass);
					}
				}
			});
		}
	}
}).listen(3000);
