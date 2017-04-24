// Load assets

var Splab = Splab || {};

Splab.Preload = function() {};

var text;

Splab.Preload.prototype = {
	loadAssets: function() {
		// this.game.load.image('manly_chicken', 'assets/sprites/manly_chicken.jpg');
		this.game.load.image('c', 'assets/sprites/c.png');
		this.game.load.image('platform', 'assets/sprites/platform.png');
        this.game.load.spritesheet('cflap', 'assets/sprites/cflap.png', 32, 32, 8);
        this.game.load.spritesheet('girlhair', 'assets/sprites/girlhair.png', 32, 32, 8);
        this.game.load.spritesheet('guyhair', 'assets/sprites/guyhair.png', 32, 32, 8);
        this.game.load.spritesheet('sciwalk', 'assets/sprites/sciwalk.png', 32, 32, 8);
        this.game.load.spritesheet('sciface', 'assets/sprites/sciface.png', 32, 32, 8);
        this.game.load.spritesheet('scishirt', 'assets/sprites/scishirt.png', 32, 32, 8);
        this.game.load.spritesheet('allwalk', 'assets/sprites/allwalk.png', 32, 32, 16)
		this.game.load.image('splab1', 'assets/sprites/splab1.png');
		this.game.load.image('splabfloor', 'assets/sprites/splabfloor.png');
        this.load.image('background','assets/sprites/starry.png');

	},
    register: function() {
        // register current client with server
        Splab.game.global.socket = io.connect("http://localhost:5000");
        Splab.game.global.socket.on('connection', function(data) {
            console.log(data);
            Splab.game.global.roomState = data.state;
            console.log(Splab.game.global);
            Splab.game.state.start("MainMenu");
        });
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
		this.register();
	},
	create: function() {
		/*this.state.start('MainGame');*/
	}
};
