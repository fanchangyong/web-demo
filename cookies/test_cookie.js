var http = require('http')
var cookie = require('cookie');

// Create server
var server = http.createServer(function(req, res){
	var cookieobj = null;
	if(req.headers.cookie){
		cookieobj = cookie.parse(req.headers.cookie);
	}
	if(cookieobj && cookieobj.foo){
		res.end('Cookies has been sent early!');
	}else{
		var hdr=cookie.serialize('foo','bar',{
			maxAge:5,
			path:'/abc',
			domain:''
		});
		res.setHeader('Set-Cookie',hdr);
		res.end('Cookie Set Now!');
	}
})

// Listen
server.listen(3000)
