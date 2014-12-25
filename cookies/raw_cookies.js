var http = require('http');
var cookie = require('cookie');
var util = require('util');

http.createServer(function(req,res){
	var cookies = [];
	if(req.headers.cookie){
		cookies = cookie.parse(req.headers.cookie);
	}
	if(req.url=='/'){
		if(cookies['raw-cookie']){
			res.write('I have received your cookie:'+cookies['raw-cookie']);
		}else{
			var send_cookie = cookie.serialize('raw-cookie',
				Math.random().toString(),{
					path:'/',
					domain:'ubuntu.vm',
					httpOnly:true,
					//maxAge:3
			});
			res.setHeader('set-cookie',send_cookie);
			res.write("Your cookie has been regenerated:"+send_cookie.toString());
		}
		res.end();
	}else if(req.url=='/clear'){
		var send_cookie = cookie.serialize('raw-cookie','deleted',{
			path:'/',
			domain:'ubuntu.vm',
			expires:new Date(0)
		});
		res.setHeader('set-cookie',send_cookie);
		res.end('Your cookie has been cleared:'+send_cookie);
	}else{
		res.end('Unused URL!');
	}
}).listen(3000);
