const express = require('express');//importing libraries from express
const app = express();
const socketIo = require('socket.io');
const port = 8080 || process.env.PORT;
const http = require('http');
const httpServer = http.Server(app);
const ioServer = socketIo(httpServer);
var allSockets = {}, allUsers = {};

app.use(express.static(__dirname + '/public'));

function userJoined(user){
	console.log(user + ' joined');

	let d = Math.floor(Math.random() * 4);
	if(d === 0){
		d = 'n';
	}else if(d === 1){
		d = 'e';
	}else if(d === 2){
		d = 'w';
	}else{
		d = 's';
	}

	allSockets[user] = this;
	allUsers[user] = {
		name: user,
		timeOfEvent: 0,
		x: Math.floor(Math.random() * 90),
		y: Math.floor(Math.random() * 80),
		d: d
	};

	ioServer.emit('user-joined', allUsers);
}

function userLeft(){
	var user = null;
	var allKeys = Object.keys(allSockets);

	for(i = 0; i < allKeys.length; i++){
		if(allSockets[allKeys[i]] === this){
			user = allKeys[i];
		}
	}

	console.log(user + ' left.');
	delete allSockets[user];
	delete allUsers[user];

    this.broadcast.emit('user-left', user);//gives message to all insted of the one leaving the server
}

function messageReceived(data){
	//console.log(data);

	if(allUsers[data.name].timeOfEvent < data.timeOfEvent){
		allUsers[data.name].timeOfEvent = data.timeOfEvent;
		if (data.action === 'reposition'){
			allUsers[data.name].x = data.x;
			allUsers[data.name].y = data.y;
			allUsers[data.name].d = data.d;

			ioServer.emit('reposition', data);
		}
	}
}

ioServer.on('connection', function(socket){
	console.log('New socket connection made');

	socket.on('user-joined', userJoined);
	socket.on('disconnect', userLeft);
	socket.on('msg', messageReceived);
});

httpServer.listen(8080, function(){
	console.log(`Server running on port 8080`);
});//0 to 1024 ports are reserved.
