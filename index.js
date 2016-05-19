var express=require('express');
var url=require('url');
var app=express();
var bodyParser=require('body-parser');
var http=require('http');
var request=require('request');
var qs=require('querystring');//解析code
var fs=require('fs');
var getUserInfo = require('./client/user').getUserInfo;
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
//app.use(express.static(__dirname+'/client'));
//处理客户端请求页面


//app.all('*',function(req,res){

//console.log(req.query);
//	var geturl=req.headers["referer"];
//	console.log(req.headers);
//	var arg=url.parse(geturl,true).query;
	//var code=qs(getQuery)["code"];
//	console.log('获取到code:',arg.code);
	
//	res.sendFile(__dirname+'/client/index.html');
//});

//var server=app.listen(4000,function(){
//	console.log('mychat is running at 4000 port!');
//});
server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
	var code=url.parse(req.url,true).query.code;
	console.log(code); 
   switch (path){
    case '/':
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h1>Hello! Try the <a href="/client/index.html">Socket.io Test</a></h1>');
        res.end();
        break;
    case '/client/index.html':
	
        fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        getUserInfo(code).then(function(userinfo){
	var headimg=userinfo.headimgurl;
	var nickname=userinfo.nickname;
	var sex=userinfo.sex;
      res.write('<head><meta charset="utf-8"/></head>');
	res.write('<div class="text-center"><div class=" btn btn-info btn-lg"><h1 class="glyphicon glyphicon-headphones">北京大学微信网络聊天室</h1></div>');
        res.write('<h3 class="white"><button type="button" class="btn btn-primary btn-lg" style="text-shadow: black 5px 3px 3px;"><span class="glyphicon glyphicon-user"></span>User</button><a id="username" href="#">'+nickname+'</a>  你好 ！<img height="60px",width="60px"src="'+headimg+'">欢迎来到mychat！ <a style="visibility:hidden" id="headurl">'+headimg+'<a></h3></div>');
	res.write(data, 'utf8');
        res.end();
});
        });
        break;
    default: send404(res);
    }
}),
 
send404 = function(res){
    res.writeHead(404);
    res.write('404');
    res.end();
};
 
server.listen(4000);

var io=require('socket.io').listen(server);
var messages=[];
messages.push('欢迎来到mychat!');
io.sockets.on('connection',function(socket){
	socket.emit('connected');
	//console.log(io);
	console.log('客户端用户已连接！');
	//广播新用户连接
	socket.broadcast.emit('newClient',new Date());
	//获取总信息
	socket.on('getAllMessages',function(){
	socket.emit('allMessages',messages);
});	
	//断开连接
	socket.on('disconnect',function(){
	console.log('有用户断开连接!');
})
	//发送新消息 on 是接收 emit是发送 握手信号
	socket.on('addMessage',function(message){
	messages.unshift(message);
	io.sockets.emit('newMessage',message);
});

})
