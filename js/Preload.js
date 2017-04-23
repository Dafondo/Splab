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
        game.load.start();

		this.state.start('MainMenu');
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
        
    }


};
