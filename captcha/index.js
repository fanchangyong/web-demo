var captcha = require('node-captcha');
var http = require('http');
var fs = require('fs');
var _url = require('url');
var util = require('util');
var session = require('express-session');
var connect = require('connect');

var app = connect();
app.use(session({
	secret:'123',
	resave:false,
	saveUninitialized:true
}));
app.use(function(req,res){
	var url = _url.parse(req.url);
	if(url.pathname=='/'){
		var options={
		};
		captcha(options,function(text,data){
			req.session.captcha=text;
			console.log('text is:',text);
			res.write('<img src="'+data+'" /><br>');
			res.write('<form method="GET" action="/submit"> \
					<input name="cap"></input> <br>\
					<input type="submit"> </input> \
				</form>');
			res.end();
		});
	}else if(url.pathname=='/submit'){
		var pairs = url.query.split('&');
		var result = [];
		for(var i=0;i<pairs.length;i++){
			var kv = {};
			var kvs = pairs[i].split('=');
			kv[kvs[0]]=kvs[1];
			result.push(kv);
		}
		var cap = null;
		for(var i=0;i<result.length;i++){
			if(result[i].cap){
				cap = result[i].cap;
				break;
			}
		}
		if(req.session.captcha==cap){
			res.end('You are a real man!');
		}else{
			res.end('You are a robot!');
		}
	}else{
		res.end('Unknown URL!');
	}
});

http.createServer(app).listen(3000);
