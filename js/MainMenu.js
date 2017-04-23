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
		capacity = game.add.inputField(10, 180, {
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
		button = this.add.button(game.world.centerX, game.world.centerY, 'c', this.startGame, this, 2, 1, 0);
		button.anchor.set(0.5, 0.5);
		button.smoothed = false;
		button.scale.setTo(6);
	},
	update: function() {
	}
};
