var http = require('http');
var fs = require('fs');
var url = require('url');

function form_to_json(data){
	var kvs = data.split('&');

	var pairs = [];
	for(var i=0;i<kvs.length;i++){
		var pair = kvs[i].split('=');
		var kv = {};
		kv[pair[0]]=pair[1];
		pairs.push(kv);
	}
	console.log('pairs:',pairs);
}

http.createServer(function(req,res){
	console.log('req.method:',req.method);
	var req_url = url.parse(req.url);
	console.log('url:',req_url);
	if(req_url.pathname=='/'){
		fs.createReadStream('./index.html').pipe(res);
	}else if(req_url.pathname=='/submit'){
		if(req.method=='GET'){
			res.end("This is what your url looks like:"+req.url.toString());
		}else if(req.method=='POST'){
			var postdata = '';
			req.on('data',function(chunk){
				postdata+=chunk;
			});
			req.on('end',function(){
				form_to_json(postdata);
				res.end("This is your psted data:"+postdata.toString());
			});
		}
	}else{
		res.setHeader('content-type','text/html');
		res.end('Invalid URL:'+req.url.toString()+
			'<br>Method:'+req.method);
	}
}).listen(3000);
