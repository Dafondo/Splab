// Load assets

var Splab = Splab || {};

Splab.Preload = function() {};

var text;
var waitLoop;

Splab.Preload.prototype = {
	loadAssets: function() {
		// this.game.load.image('manly_chicken', 'assets/sprites/manly_chicken.jpg');
		this.game.load.image('c', 'assets/sprites/c.png');
		this.game.load.image('platform', 'assets/sprites/platform.png');
        this.game.load.spritesheet('cflap', 'assets/sprites/cflap.png', 32, 32, 8);
        this.game.load.spritesheet('girlhair', 'assets/sprites/girlhair.png?v=1', 32, 32, 8);
        this.game.load.spritesheet('guyhair', 'assets/sprites/guyhair.png?v=1', 32, 32, 8);
        this.game.load.spritesheet('sciwalk', 'assets/sprites/sciwalk.png', 32, 32, 8);
        this.game.load.spritesheet('sciface', 'assets/sprites/sciface.png', 32, 32, 8);
        this.game.load.spritesheet('scishirt', 'assets/sprites/scishirt.png', 32, 32, 8);
        this.game.load.spritesheet('allwalk', 'assets/sprites/allwalk.png', 32, 32, 16)
		this.game.load.spritesheet('splab2ss', 'assets/sprites/splab2ss.png', 128, 128, 8);
		this.game.load.image('splab1', 'assets/sprites/splab1a.png?v=1');
		this.game.load.image('splab2', 'assets/sprites/splab2.png?v=2');
		this.game.load.image('splabfloor', 'assets/sprites/splabfloor.png');
		this.game.load.audio('bawk', 'assets/audio/chicken.wav');
		this.game.load.audio('music', 'assets/audio/DigitalLemonade.mp3')
        this.load.image('background','assets/sprites/starry.png');

	},
    register: function() {
        // register current client with server
        Splab.game.global.socket = io.connect("http://hatch01.cs.unc.edu:5000");
        Splab.game.global.socket.on('connection', function(data) {
            console.log(data);
            Splab.game.global.roomState = data.state;
            console.log(Splab.game.global);
            Splab.game.state.start("MainMenu");
        });
        Splab.game.global.socket.on('start', function(data) {
            console.log('start!');
            console.log(data);
            Splab.game.global.state = data;
            Splab.game.state.start('MainGame');
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
	startMainMenu: function() {
		if(Splab.game.global.roomState != null) {
			console.log("stuff");
			this.time.events.remove(waitLoop);
			this.state.start('MainMenu');
		}
	},
    loadComplete: function() {
        text.setText("Load Complete");
        console.log("chicken chicken");
        if(Splab.game.global.roomState == null) waitLoop = this.time.events.loop(100, this.startMainMenu, this);
		else this.state.start('MainMenu');
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
		// this.state.start('MainGame');
	}
};
