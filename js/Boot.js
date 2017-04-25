// Splash screen

var Splab = Splab || {};

Splab.Boot = function(){};

Splab.Boot.prototype = {
	init: function() {
	},
	preload: function() {
	},
	create: function() {
		this.state.start('Preload');
	}
};
