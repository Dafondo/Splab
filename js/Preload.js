// Load assets

var Splab = Splab || {};

Splab.Preload = function() {};

var text;

Splab.Preload.prototype = {
	loadAssets: function() {
		// this.game.load.image('manly_chicken', 'assets/sprites/manly_chicken.jpg');
		this.game.load.image('c', 'assets/sprites/c.png');
		this.game.load.image('platform', 'assets/sprites/platform.png');
        this.load.image('background','assets/sprites/black.jpg');

	},
    loadStart: function() {
        text.setText("Loading ...");
    },
    //	This callback is sent the following parameters:
    fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
        text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);

        var newImage = game.add.image(x, y, cacheKey);

        newImage.scale.set(0.3);

        x += newImage.width + 20;

        if (x > 700)
        {
            x = 32;
            y += 332;
        }
    },
    loadComplete: function() {
        text.setText("Load Complete");
        console.log("chicken chicken");
    },
	init: function() {
        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onLoadComplete.add(this.loadComplete, this);
        text = this.add.text(32, 32, 'Click to start load', { fill: '#ffffff' });
	},
	preload: function() {
		this.loadAssets();
	},
	create: function() {
		this.state.start('MainMenu');
	}
};
