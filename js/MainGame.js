var Splab = Splab || {};

// Controls
var cursors;
var key_jump;
var transform;
var key_run;

var speed = 1;

var isChicken = false;

// Sprites
var stars;
var background;
var player;
var platforms;
var face;
var guyhair;
var girlhair;

var bawk;

// Animations
var cloudEmitter;
var sciwalk;
var cwalk;
var faceBounce;
var guyhairBounce;
var girlhairBounce;
var shirtBounce;
var sciFPS = 12;
var cFPS = 24;
var starSpeed = -10;
var bgSpeed = -20;

// Timers
var transformTime = 3;
var lastTransform = 0;
var cooldown = 3000;

var viewWindowSize = 512;
var myPos;
var worldSize;
var npcLocs = []
var npcProperties = []
var playerLocs = []
var playerInfo = []
var myInfo;
var npcs = []

var shirtColors = ['#FF0000', '#00FFFF', '#0000FF', '#008000', '#FFA500',
                   '#808080', '#000000', '#800000', '#0000A0', '#FFFF00']

var hairColors = ['#090806', '#2C222B', '#71635A', '#B7A69E', '#D6C4C2',
                  '#CABFB1', '#DCD0BA', '#6A4E42', '#E6CEA8', '#E5C8A8',
                  '#DEBC99', '#B89778', '#A56B46', '#B55239', '#8D4A43',
                  '#91553D', '#A7856A', '#3B3024', '#554838', '#4E433F']

var walkSpeed = 1;
var runSpeed = 1;

Splab.MainGame = function(){};

Splab.MainGame.prototype = {
	init: function() {
	    npcLocs = Splab.game.global.state.npcs_init;
	    npcProperties = Splab.game.global.state.npcs;

	    for (var i = 0 ; i < Splab.game.global.state.players.length ; i++) {
            if (Splab.game.global.state.players[i].id == Splab.game.global.myID) {
                myInfo = Splab.game.global.state.players[i];
                myPos = Splab.game.global.state.players_init[i];
            }
            else { // other players info stored separately
                playerInfo.push(Splab.game.global.state.players[i]);
                playerLocs.push(Splab.game.global.state.players_init[i]);
            }
        }

        worldSize = Splab.game.global.state.world_size;
	},

	preload: function() {
	},
	startRun: function() {
		sciFPS *= 2;
		cFPS *= 2;
		starSpeed *= 1.5;
		bgSpeed *= 2;
		stars.autoScroll(starSpeed, 0);
		background.autoScroll(bgSpeed, 0);
		sciwalk.speed *= 2;
		cwalk.speed *= 2;
		faceBounce.speed *= 2;
		guyhairBounce.speed *= 2;
		girlhairBounce.speed *= 2;
		shirtBounce.speed *= 2;
	},
	endRun: function() {
		sciFPS /= 2;
		cFPS /= 2;
		starSpeed /= 1.5;
		bgSpeed /= 2;
		stars.autoScroll(starSpeed, 0);
		background.autoScroll(bgSpeed, 0);
		sciwalk.speed /= 2;
		cwalk.speed /= 2;
		faceBounce.speed /= 2;
		guyhairBounce.speed /= 2;
		girlhairBounce.speed /= 2;
		shirtBounce.speed /= 2;
	},
	create: function() {
		stars = this.add.tileSprite(0, 0, 2048, this.game.height, 'background');
		stars.autoScroll(starSpeed, 0);
        background = this.add.tileSprite(0, 0, 2048, 128, 'splab1');
		background.scale.setTo(4);
		background.smoothed = false;
		background.autoScroll(bgSpeed, 0);

		// Don't know why, but don't remove this
		floor = this.make.sprite(0, 0, 'splabfloor');
		floor.alpha = 0;
		floor.smoothed = false;
		background.addChild(floor);

        this.world.setBounds(0, 0, 2048, 512);

        this.stage.backgroundColor = '#ffffff';

		// Enable physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Create player body
		player = this.game.add.sprite(game.world.centerX, this.game.world.height - 100, 'allwalk');
        player.anchor.set(0.5, 0.5);
        player.smoothed = false;
        player.scale.setTo(4);
		this.game.physics.arcade.enable(player);

		// Create player components
        face = this.make.sprite(0, 0, 'sciface');
        face.anchor.set(0.5, 0.5);
        face.smoothed = false;
        face.tint = Math.random() * 0xffffff;
        player.addChild(face);

        guyhair = this.make.sprite(0, 0, 'guyhair');
        guyhair.anchor.set(0.5, 0.5);
        guyhair.smoothed = false;
        guyhair.tint = Math.random() * 0xffffff;
        player.addChild(guyhair);

        girlhair = this.make.sprite(0, 0, 'girlhair');
        girlhair.anchor.set(0.5, 0.5);
        girlhair.smoothed = false;
        girlhair.tint = Math.random() * 0xffffff;
        player.addChild(girlhair);

        shirt = this.make.sprite(0, 0, 'scishirt');
        shirt.anchor.set(0.5, 0.5);
        shirt.smoothed = false;
        shirt.tint = Math.random() * 0xffffff;
        player.addChild(shirt);

        if(Math.floor(Math.random() * 2) == 0) girlhair.alpha = 0;
        else guyhair.alpha = 0;

		// Create animations
        sciwalk = player.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
        cwalk = player.animations.add('cwalk', [8, 9, 10, 11, 12, 13, 14, 15]);
        faceBounce = face.animations.add('bounce');
        guyhairBounce = guyhair.animations.add('bounce');
        girlhairBounce = girlhair.animations.add('bounce');
        shirtBounce = shirt.animations.add('bounce');

		// Play animations
        player.animations.play('sciwalk', sciFPS, true);
        face.animations.play('bounce', sciFPS, true);
        guyhair.animations.play('bounce', sciFPS, true);
        girlhair.animations.play('bounce', sciFPS, true);
        shirt.animations.play('bounce', sciFPS, true);

		// Player physics
		player.body.bounce.y = 0;
		player.body.gravity.y = 0;
		player.body.collideWorldBounds = true;

		// Create platforms that the player can walk on
		platforms = this.game.add.group();
		platforms.enableBody = true;
		ground = [platforms.create(0, this.game.world.height - 10, 'splabfloor'), platforms.create(512, this.game.world.height - 10, 'splabfloor'), platforms.create(1024, this.game.world.height - 10, 'splabfloor'), platforms.create(1536, this.game.world.height - 10, 'splabfloor')];
		ground.forEach((tile) => tile.scale.setTo(4));
		ground.forEach((tile) => tile.body.immovable = true);

		// Create ground and platforms
		/*var ground = platforms.create(0, this.game.world.height - 64, 'platform');
		ground.scale.setTo(2, 2); // scale to width of the game
		ground.body.immovable = true;
		var ledges = [ platforms.create(400, 400, 'platform'), platforms.create(-150, 250, 'platform') ];
		ledges.forEach((ledge) => ledge.body.immovable = true);*/

		// Create cursor keys
		cursors = this.game.input.keyboard.createCursorKeys();
		key_jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        transform = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
		key_run = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		key_run.onDown.add(this.startRun, this);
		key_run.onUp.add(this.endRun, this);

		bawk = this.add.audio('bawk');
		bawk.loop = true;

		Splab.game.global.music = this.add.audio('music');
		Splab.game.global.music.loop = true;
		Splab.game.global.music.play();

        this.camera.follow(player);
	},
    transformBack: function() {
        face.tint = Math.random() * 0xffffff;
        guyhair.tint = Math.random() * 0xffffff;
        girlhair.tint = Math.random() * 0xffffff;
        shirt.tint = Math.random() * 0xffffff;

        face.alpha = 1;
        if(Math.floor(Math.random() * 2) == 0) guyhair.alpha = 1;
        else girlhair.alpha = 1;
        shirt.alpha = 1;

        face.animations.play('bounce', sciFPS, true);
        guyhair.animations.play('bounce', sciFPS, true);
        girlhair.animations.play('bounce', sciFPS, true);
        shirt.animations.play('bounce', sciFPS, true);
        player.animations.play('sciwalk', sciFPS, true);

        starSpeed /= 1.5;
		bgSpeed /= 2;

		stars.autoScroll(starSpeed, 0);
		background.autoScroll(bgSpeed, 0);

		isChicken = false;
    },
	update: function() {
	    npcs.map(function(n) {n.destroy()});
	    // draw all npcs / other players
	    var relativeNPCLocs = npcLocs.map(function(l) {
            if (l - myPos < 0) {
                return ((l - myPos) % worldSize + worldSize) % worldSize;
            }
            else {
                return l - myPos;
            }
        });

        for (var i = 0 ; i < npcLocs.length ; i++) {
            if ((relativeNPCLocs[i] >= 0 && relativeNPCLocs[i] <= 256) ||
                (relativeNPCLocs[i] >= 256 && relativeNPCLocs[i] <= 512)) {
                // we render this npc
                var adjustedLoc = relativeNPCLocs[i];
                if (adjustedLoc >= 256) {
                    adjustedLoc = -1 * (512 - adjustedLoc);
                }
                //console.log(adjustedLoc);
                var npc = this.game.add.sprite(this.game.world.centerX + adjustedLoc, this.game.world.height-64, 'allwalk');
                npc.anchor.set(0.5, 0.5);
                npc.smoothed = false;
                if (npcProperties[i].facing) {
                    npc.scale.setTo(4);
                }
                else {
                    npc.scale.setTo(4);
                    npc.scale.x = -4;
                }

                var face = this.make.sprite(0, 0, 'sciface');
                face.anchor.set(0.5, 0.5);
                face.smoothed = false;
                face.tint = Math.random() * 0xffffff;
                npc.addChild(face);

		        shirtBounce = shirt.animations.add('bounce');


                if (npcProperties[i].appearance.hair == 0) {
                    var guyhair = this.make.sprite(0, 0, 'guyhair');
                    guyhair.anchor.set(0.5, 0.5);
                    guyhair.smoothed = false;
                    guyhair.tint = hairColors[npcProperties[i].appearance.hair_color];
                    npc.addChild(guyhair);
					guyhair.animations.add('bounce');
                    guyhair.animations.play('bounce', sciFPS, true);
                }
                else {
                    var girlhair = this.make.sprite(0, 0, 'girlhair');
                    girlhair.anchor.set(0.5, 0.5);
                    girlhair.smoothed = false;
                    girlhair.tint = hairColors[npcProperties[i].appearance.hair_color];
					girlhair.animations.add('bounce');
                    girlhair.animations.play('bounce', sciFPS, true);
                    npc.addChild(girlhair);
                }

                var shirt = this.make.sprite(0, 0, 'scishirt');
                shirt.anchor.set(0.5, 0.5);
                shirt.smoothed = false;
                shirt.tint = shirtColors[npcProperties[i].appearance.shirt];
                npc.addChild(shirt);

                this.game.physics.arcade.enable(npc);
		        face.animations.add('bounce');
				shirt.animations.add('bounce');
				npc.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
                face.animations.play('bounce', sciFPS, true);
                shirt.animations.play('bounce', sciFPS, true);
                npc.animations.play('sciwalk', sciFPS, true);

                //npc.body.gravity.y = 2000;
                npcs.push(npc);
            }
        }


        // moveeeee!
        for (var i = 0 ; i < npcLocs.length ; i++) {
            var speed = walkSpeed;
            if (npcProperties[i].running) {
                speed = runSpeed;
            }
            if (!npcProperties[i].facing) {
                speed = -1 * speed;
            }

            npcLocs[i] = (npcLocs[i] + speed) % worldSize;
        }

        // Check collisions
        var hitPlatform = game.physics.arcade.collide(player, platforms);

		// Move with arrow keys
		if (cursors.left.isDown) {
			if(starSpeed < 0) starSpeed *= -1;
			if(bgSpeed < 0)	bgSpeed *= -1;
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

            player.scale.x = -4;
		}
		else if (cursors.right.isDown) {
			if(starSpeed > 0) starSpeed *= -1;
			if(bgSpeed > 0) bgSpeed *= -1;
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

            player.scale.x = 4;
		}

		// Jump
		if (key_jump.isDown && player.body.touching.down && hitPlatform) {
			player.body.velocity.y -= isChicken ? 750 : 600; // TODO use impulse instead
		}

		// Gravity
		player.body.gravity.y = isChicken ? 200 : 2000;

		if(!isChicken) {
			bawk.stop();
		}

        // Transform
        if(transform.isDown && lastTransform + cooldown < this.time.now) {
            face.alpha = 0;
            guyhair.alpha = 0;
            girlhair.alpha = 0;
            shirt.alpha = 0;

            player.animations.play('cwalk', cFPS, true);
            face.animations.stop();
            guyhair.animations.stop();
            girlhair.animations.stop();
            shirt.animations.stop();

			starSpeed *= 1.5;
			bgSpeed *= 2;
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

            this.time.events.add(Phaser.Timer.SECOND * transformTime, this.transformBack, this);
			lastTransform = this.time.now + transformTime * 1000;

			bawk.play();

			isChicken = true;
        }
	}
}
