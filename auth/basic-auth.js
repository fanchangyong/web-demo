/*
 * basic auth是最简单的验证方式
 * 服务器检查客户端发送的authorization头部
 * 解析其中包含的用户名/密码
 * 如果通过，就返回通过信息。客户端从此之后会
 * 自动发送对应的authorization头部。
 * 如果不通过，服务器返回401和'www-authenticate'
 * 头部,客户端根据这个信息显示对话框让用户输入.
 * 如果要清除当前的登录状态,可以
 */
var http = require('http')
var auth = require('basic-auth')

// Create server
var server = http.createServer(function(req, res){
	console.log('authentication:',req.headers.authorization);
	if(req.url=='/secret'){
		var credentials = auth(req)
		if (!credentials || credentials.name !== 'john' || credentials.pass !== 'secret') {
			res.writeHead(401, {
				'WWW-Authenticate': 'Basic realm="example"'
			})
			res.write('Access Denied!');
			res.end()
		} else {
			res.end('Access granted');
		}
	}else if(req.url=='/clear'){
		res.writeHead(401, {
			'WWW-Authenticate': 'Basic realm="example"'
		})
		res.write('Authentication cleared,login again!');
		res.end();
	}else{
		res.end('Safe area,dont need auth!');
	}
})

// Listen
server.listen(3000)
