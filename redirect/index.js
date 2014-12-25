var http = require('http');
var fs = require('fs');

http.createServer(function(req,res){
	if(req.url=='/'){
		console.log('sfdssfd');
		fs.createReadStream('./index.html').pipe(res);
		//res.statusCode=301;
		//res.setHeader('Location','http://localhost:3000/login.html');
		//res.end('redirected');
	}else if(req.url=='/login.html'){
		fs.createReadStream('./login.html').pipe(res);
	}else{
		res.end('Unhandled url!');
	}
}).listen(3000);

