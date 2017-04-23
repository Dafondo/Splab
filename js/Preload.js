// Load assets

var Splab = Splab || {};

Splab.Preload = function() {};

Splab.Preload.prototype = {
	loadAssets: function() {
		// this.game.load.image('manly_chicken', 'assets/sprites/manly_chicken.jpg');

		this.game.load.image('c', 'assets/sprites/c.png');
		this.game.load.image('platform', 'assets/sprites/platform.png');
	},

	init: function() {
	},

	preload: function() {
		this.loadAssets();
	},

	create: function() {
		this.state.start('MainMenu');
	}
};
