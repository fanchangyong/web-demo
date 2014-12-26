var http = require('http');
var _cookie = require('cookie');
var _url = require('url');
var fs = require('fs');

var sessions = [];

var cur_sessionid = 0;

function Session(user,pass){
	this.username = user;
	this.password = pass;
	this.sessionid = cur_sessionid++;
}

function getSession(username){
	for(var i=0;i<sessions.length;i++){
		if(sessions[i].username==username){
			return sessions[i];
		}
	}
	return null;
}

function delSessionById(sessionid){
	for(var i=0;i<sessions.length;i++){
		if(sessions[i].sessionid==sessionid){
			sessions.splice(i,1);
			break;
		}
	}
}

function getSessionById(sessionid){
	for(var i=0;i<sessions.length;i++){
		if(sessions[i].sessionid==sessionid){
			return sessions[i];
		}
	}
	return null;
}

http.createServer(function(req,res){
	var url = _url.parse(req.url);
	var cookies = {};
	if(req.headers.cookie){
		cookies = _cookie.parse(req.headers.cookie);
	}

	console.log('cookies:',cookies,'\n\n');

	if(url.pathname=='/'){
		var sessionid = cookies.sessionid;
		if(!sessionid){
			console.log('redirecting!!!');
			res.statusCode=302;
			res.setHeader('Location','/login.html');
			res.end();
		}else{
			var session = getSessionById(sessionid);
			if(!session){
				res.statusCode = 302;
				res.setHeader('location','/logout');
				res.end();
			}else{
				res.setHeader('content-type','text/html');
				res.write('<h1>Welcome '+session.username+',sessionid:'+
						sessionid+'</h1>');
				res.write('<br><a href="/logout">Logout</a>');
				res.end();
			}
		}
	}else if(url.pathname=='/logout'){
		var sessionid = cookies.sessionid;
		delSessionById(sessionid);
		var res_cookie = _cookie.serialize('sessionid','deleted',{
			domain:'ubuntu.vm',
			expires:new Date(0)
		});
		res.statusCode = 302;
		res.setHeader('Location','/');
		res.setHeader('set-cookie',res_cookie);
		res.end('Logout!');
	}else if(url.pathname=='/login'){
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
				var session = getSession(kv.user);
				console.log('session:',session);
				if(!session){
					var expires = undefined;
					console.log('kv:',kv);
					if(kv.remember){
						expires = new Date(Date.now()+100000000000);
					}
					var session = new Session(kv.user,kv.pass);
					sessions.push(session);
					var res_cookie = _cookie.serialize('sessionid',
							session.sessionid,{
								expires:expires,
								domain:'ubuntu.vm'
							});
					console.log('res cookie:',res_cookie);
					res.setHeader('set-cookie',res_cookie);
				}
				res.statusCode=302;
				res.setHeader('location','/');
				res.end();
			});
		}else{
			res.end('POST Only!');
		}
	}else if(url.pathname=='/login.html'){
		fs.createReadStream('login.html').pipe(res);
	}
}).listen(3000);
