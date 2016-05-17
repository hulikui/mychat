var express=require('express');
var path=require('path');
var app=express();
app.use(express.static(__dirname+'/client'));
//处理客户端请求页面
app.use(function(req,res){
	res.sendFile(__dirname+'/client/index.html');
});

var server=app.listen(4000,function(){
	console.log('mychat is running at 4000 port!');
});
var io=require('socket.io').listen(server);
var messages=[];
messages.push('欢迎来到mychat!');
io.sockets.on('connection',function(socket){
	socket.emit('connected');
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
