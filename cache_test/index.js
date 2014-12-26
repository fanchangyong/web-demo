var crypto = require('crypto');
var fs = require('fs');
var http = require('http');

http.createServer(function(req,res){
	if(req.url=='/'){
		fs.readFile('./resource.html',function(err,data){
			var client_etag = req.headers['if-none-match'];
			var if_modified_since = null;
			if(req.headers['if-modified-since']){
				if_modified_since = new Date(req.headers['if-modified-since']);
			}
			var etag = crypto.createHash('sha1').update(data).digest('hex');

			var stats = fs.statSync('./resource.html');
			var atime = stats.atime;

			res.setHeader('cache-control','no-cache');
			res.setHeader('etag',etag);
			res.setHeader('Last-Modified',atime);

			if(client_etag==etag &&
				if_modified_since.valueOf() == atime.valueOf()){
				res.statusCode = 304;
				res.end();
			}else{
				res.setHeader('etag',etag);
				res.write(data);
				res.end();
			}
		})
	}
}).listen(3000);
