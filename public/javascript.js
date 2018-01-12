$(document).ready(function(){
	var socket, currentUser, dx, dy;

	currentUser = {};
	dx = 0.01;
	dy = 0.01;

	function socketConnected(){
		currentUser.name = window.prompt("Enter username...");
		$('title').html(currentUser.name);

		socket.emit('user-joined', currentUser.name);
	}

	function userJoined(allUsers){
		currentUser = allUsers[currentUser.name];
		$('#main').empty();

		var allKeys = Object.keys(allUsers);
		for(i = 0; i < allKeys.length; i++){
			var user = allUsers[allKeys[i]];

			var tank = $('<div />').html($('#tankTemplate').html()).addClass("tank");
			tank.find('span[purpose=name]').html(user.name).attr('name', user.name);
			if(user.x<10) user.x=10;
			if(user.y<10) user.y=10;

			tank.css({
				top: user.y + "%",
				left: user.x + "%"
			});

			if(user.d === 'n'){
				tank.addClass('north')
			} else if(user.d === 'e'){
				tank.addClass('east');
			} else if(user.d === 'w'){
				tank.addClass('west');
			} else if(user.d === 's'){
				tank.addClass('south');
			}

			$('#main').append(tank);
			$('.tank').attr('id','myTank');
            $('html,body').animate({scrollTop: $('#myTank').offset().top}, 0);
			$('html,body').animate({scrollLeft: $('#myTank').offset().left}, 0);
		}
	}

	function userLeft(user){
		if(user && user.name){
			$('span[name=' + user.name + ']').prev().attr('src', '/images/ship-dead.png');
			if(user.name === currentUser.name){
				$(document).off("keypress");
			}

			window.setTimeout(function() {
				$('span[name=' + user.name + ']').parent().remove();
				if(user.name === currentUser.name){
					alert("Game over");
				}
			}, 2000);
		}
	}

	function reposition(user){
		if(user && user.name){
			var tank = $('span[name=' + user.name + ']').parent();
			tank.css({
				top: user.y + "%",
				left: user.x + "%"
			});


			tank.removeClass('north east west south');
			if(user.d === 'n'){
				tank.addClass('north');
			} else if(user.d === 'e'){
				tank.addClass('east');
			} else if(user.d === 'w'){
				tank.addClass('west');
			} else if(user.d === 's'){
				tank.addClass('south');
			}
		}
	}

	function handleKey(){
		var deltaX = 0, deltaY = 0;

		currentUser.timeOfEvent = Date.now();
		switch(window.event.which){
			case 119:
				currentUser.action = 'reposition';
				if(currentUser.d === 'n'){
					deltaY = -dy;
				}
				else if(currentUser.d === 'e'){
					deltaX = dx;
				}
				else if(currentUser.d === 'w'){
					deltaX = -dx;
				}
				else if(currentUser.d === 's'){
					deltaY = dy;
				}

				if(currentUser.x + deltaX <= 90 && currentUser.x + deltaX >= 0){
					currentUser.x += deltaX;
					window.scrollBy(deltaX*100,0);
					console.log("moves");
				}

				if(currentUser.y + deltaY <= 80 && currentUser.y + deltaY >= 0){
					currentUser.y += deltaY;
					window.scrollBy(0,deltaY*100);
				}
			 	break;
			case 115:
				currentUser.action = 'reposition';
				if(currentUser.d === 'n'){
					deltaY = -dy;
				}
				else if(currentUser.d === 'e'){
					deltaX = dx;
				}
				else if(currentUser.d === 'w'){
					deltaX = -dx;
				}
				else if(currentUser.d === 's'){
					deltaY = dy;
				}

				if(currentUser.x - deltaX <= 90 && currentUser.x - deltaX >= 0){
					currentUser.x -= deltaX;
					window.scrollBy(deltaX,0);
				}

				if(currentUser.y - deltaY <= 80 && currentUser.y - deltaY >= 0){
					currentUser.y -= deltaY;
					window.scrollBy(0,deltaY);
				}
			 	break;
			case 97:
				currentUser.action = 'reposition';
				if(currentUser.d === 'n'){
					currentUser.d = 'w';
				}
				else if(currentUser.d === 'e'){
					currentUser.d = 'n';
				}
				else if(currentUser.d === 'w'){
					currentUser.d = 's';
				}
				else if(currentUser.d === 's'){
					currentUser.d = 'e';
				}
				break;
			case 100:
				currentUser.action = 'reposition';
				if(currentUser.d === 'n'){
					currentUser.d = 'e';
				}
				else if(currentUser.d === 'e'){
					currentUser.d = 's';
				}
				else if(currentUser.d === 'w'){
					currentUser.d = 'n';
				}
				else if(currentUser.d === 's'){
					currentUser.d = 'w';
				}
				break;
			default:
				break;
		}

		socket.emit('msg', currentUser);
		window.event.preventDefault();
	}

	// define Init
	function Init(){
		socket = io();

		socket.on("connect", socketConnected);
		socket.on('user-joined', userJoined);
		socket.on('user-left', userLeft);
		socket.on('reposition', reposition);

		$(document).on("keypress", handleKey);
	}

	// Call Init
	Init();
});
