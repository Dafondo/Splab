var Splab = Splab || {};

Splab.MainMenu = function(){};

// Input fields
var username;
var capacity;

var button

Splab.MainMenu.prototype = {
	startGame: function() {
		this.state.start('MainGame');
	},
    sendInfo: function() {
        console.log("hii");
        if (Splab.game.global.roomState === "empty") {
            console.log("HIIII");
            Splab.game.global.socket.emit('create', {'uname': username.value,
                                                     'capacity': parseInt(capacity.value, 10),
                                                     'size': size.value});

            console.log({'uname': username.value,
                                                     'capacity': parseInt(capacity.value, 10),
                                                     'size': size.value});

        }
        else {
            // this is on join then!
            Splab.game.global.socket.emit('join', username.value);
            console.log(username.value);
        }
    },
	init: function() {
		this.add.plugin(PhaserInput.Plugin);
	},
	preload: function() {

	},
	create: function() {
		username = game.add.inputField(10, 90, {
			font: '18px Arial',
		    fill: '#212121',
		    fontWeight: 'bold',
		    width: 150,
		    padding: 8,
		    borderWidth: 1,
		    borderColor: '#000',
		    borderRadius: 6,
		    placeHolder: 'Username',
		});
		console.log(Splab.game.global.roomState);
		if (Splab.game.global.roomState === "empty") {
		    // create a room
		    console.log('create');
            capacity = game.add.inputField(10, 130, {
                font: '18px Arial',
                fill: '#212121',
                fontWeight: 'bold',
                width: 150,
                padding: 8,
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 6,
                placeHolder: 'Capacity',
                type: PhaserInput.InputType.number
            });
            size = game.add.inputField(10, 170, {
                font: '18px Arial',
                fill: '#212121',
                fontWeight: 'bold',
                width: 150,
                padding: 8,
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 6,
                placeHolder: 'Size (small, medium or large)',
            });
        }
        else {
            // joining a game, don't do anything
        }
		button = this.add.button(game.world.centerX, game.world.centerY, 'c', this.sendInfo, this, 2, 1, 0);
		button.anchor.set(0.5, 0.5);
		button.smoothed = false;
		button.scale.setTo(6);
	},
	update: function() {
	}
};
