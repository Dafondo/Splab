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
var transformTime = 5;
var lastTransform = 0;
var cooldown = 2000;
var chickenBar;
var chickenBarIndex;
var chickenTimerLoop;

var viewWindowSize = 512;
var myPos;
var worldSize;
var npcLocs = []
var npcProperties = []
var playerLocs = []
var playerInfo = []
var myInfo;
var npcs = []

var currentFrame = 0;
var nextFrameTime = 0;
var msPF = 1000/12;

var shirtColors = ['0xFF0000', '0x00FFFF', '0x0000FF', '0x008000', '0xFFA500',
                   '0x808080', '0x000000', '0x800000', '0x0000A0', '0xFFFF00']

var hairColors = ['0x090806', '0x2C222B', '0x71635A', '0xB7A69E', '0xD6C4C2',
                  '0xCABFB1', '0xDCD0BA', '0x6A4E42', '0xE6CEA8', '0xE5C8A8',
                  '0xDEBC99', '0xB89778', '0xA56B46', '0xB55239', '0x8D4A43',
                  '0x91553D', '0xA7856A', '0x3B3024', '0x554838', '0x4E433F']

var faceColors = ['0x8d5524', '0xc68642', '0xe0ac69', '0xf1c27d', '0xffdbac']

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

        this.stage.backgroundColor = '0xffffff';

		// Enable physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Create player body
		player = this.game.add.sprite(game.world.centerX, this.game.world.height - 74, 'allwalk');
        player.anchor.set(0.5, 0.5);
        player.smoothed = false;
        player.scale.setTo(4);
		this.game.physics.arcade.enable(player);

		// Create player components
        playerface = this.make.sprite(0, 0, 'sciface');
        playerface.anchor.set(0.5, 0.5);
        playerface.smoothed = false;
        playerface.tint = Math.random() * 0xffffff;
        player.addChild(playerface);

        playerguyhair = this.make.sprite(0, 0, 'guyhair');
        playerguyhair.anchor.set(0.5, 0.5);
        playerguyhair.smoothed = false;
        playerguyhair.tint = Math.random() * 0xffffff;
        player.addChild(playerguyhair);

        playergirlhair = this.make.sprite(0, 0, 'girlhair');
        playergirlhair.anchor.set(0.5, 0.5);
        playergirlhair.smoothed = false;
        playergirlhair.tint = Math.random() * 0xffffff;
        player.addChild(playergirlhair);

        playershirt = this.make.sprite(0, 0, 'scishirt');
        playershirt.anchor.set(0.5, 0.5);
        playershirt.smoothed = false;
        playershirt.tint = Math.random() * 0xffffff;
        player.addChild(playershirt);

        if(Math.floor(Math.random() * 2) == 0) playergirlhair.alpha = 0;
        else playerguyhair.alpha = 0;

		// Create animations
        sciwalk = player.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
        cwalk = player.animations.add('cwalk', [8, 9, 10, 11, 12, 13, 14, 15]);
        faceBounce = playerface.animations.add('bounce');
        guyhairBounce = playerguyhair.animations.add('bounce');
        girlhairBounce = playergirlhair.animations.add('bounce');
        shirtBounce = playershirt.animations.add('bounce');

		// Play animations
        player.animations.play('sciwalk', sciFPS, true);
        playerface.animations.play('bounce', sciFPS, true);
        playerguyhair.animations.play('bounce', sciFPS, true);
        playergirlhair.animations.play('bounce', sciFPS, true);
        playershirt.animations.play('bounce', sciFPS, true);

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

        chickenBar = this.add.group();
        for (var i = 0; i < transformTime; i++) {
            chickenBar.create(i*24 - player.width/2, player.height/2 * -1, 'c');
        };

        chickenBar.alpha = 0;
        chickenBar.scale.set(0.25);

        player.addChild(chickenBar);

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

        this.world.bringToTop(chickenBar);

        this.camera.follow(player);
	},
    transformBack: function() {
        chickenBar.alpha = 0;
        for(var i = 0; i < chickenBar.children.length; i++) chickenBar.children[i].alpha = 1;
        playerface.tint = Math.random() * 0xffffff;
        playerguyhair.tint = Math.random() * 0xffffff;
        playergirlhair.tint = Math.random() * 0xffffff;
        playershirt.tint = Math.random() * 0xffffff;

        playerface.alpha = 1;
        if(Math.floor(Math.random() * 2) == 0) playerguyhair.alpha = 1;
        else playergirlhair.alpha = 1;
        playershirt.alpha = 1;

        playerface.animations.play('bounce', sciFPS, true);
        playerguyhair.animations.play('bounce', sciFPS, true);
        playergirlhair.animations.play('bounce', sciFPS, true);
        playershirt.animations.play('bounce', sciFPS, true);
        player.animations.play('sciwalk', sciFPS, true);

        starSpeed /= 1.5;
		bgSpeed /= 2;

		stars.autoScroll(starSpeed, 0);
		background.autoScroll(bgSpeed, 0);

		isChicken = false;
    },
    decreaseChickenBar() {
        chickenBar.children[chickenBarIndex].alpha = 0;
        if(chickenBarIndex-- === 0) this.time.events.remove(chickenTimerLoop);
    },
	update: function() {
		// Animation frame for players
		if(this.time.now > nextFrameTime) {
			currentFrame = (currentFrame + 1) % 8;
			nextFrameTime = this.time.now + msPF;
		}
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
                var npc = this.game.add.sprite(this.game.world.centerX + adjustedLoc, this.game.world.height - 74, 'allwalk');
                npc.anchor.set(0.5, 0.5);
                npc.smoothed = false;
                if (npcProperties[i].facing) {
                    npc.scale.setTo(4);
                }
                else {
                    npc.scale.setTo(4);
                    npc.scale.x = -4;
                }

                npc.frame = currentFrame;

                var face = this.make.sprite(0, 0, 'sciface');
                face.anchor.set(0.5, 0.5);
                face.smoothed = false;
                face.tint = faceColors[npcProperties[i].appearance.skin_color];
                face.frame = currentFrame;
                npc.addChild(face);


                if (npcProperties[i].appearance.hair == 0) {
                    var guyhair = this.make.sprite(0, 0, 'guyhair');
                    guyhair.anchor.set(0.5, 0.5);
                    guyhair.smoothed = false;
                    guyhair.tint = hairColors[npcProperties[i].appearance.hair_color];
                    npc.addChild(guyhair);
                    guyhair.frame = currentFrame;
                }
                else {
                    var girlhair = this.make.sprite(0, 0, 'girlhair');
                    girlhair.anchor.set(0.5, 0.5);
                    girlhair.smoothed = false;
                    //console.log(npcProperties[i].appearance.hair_color);
                    girlhair.tint = hairColors[npcProperties[i].appearance.hair_color];
                    npc.addChild(girlhair);
                    girlhair.frame = currentFrame;
                }

                var shirt = this.make.sprite(0, 0, 'scishirt');
                shirt.anchor.set(0.5, 0.5);
                shirt.smoothed = false;
                shirt.tint = shirtColors[npcProperties[i].appearance.shirt];
                npc.addChild(shirt);
                shirt.frame = currentFrame;

                this.game.physics.arcade.enable(npc);
		        //face.animations.add('bounce');
				//shirt.animations.add('bounce');
				//npc.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
                //face.animations.play('bounce', sciFPS, true);
                //shirt.animations.play('bounce', sciFPS, true);
                //npc.animations.play('sciwalk', sciFPS, true);

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

            npcLocs[i] = ((npcLocs[i] + speed) % worldSize + worldSize) % worldSize;
        }

        var mySpeed = walkSpeed;
        if (!myInfo.facing) {
            mySpeed = -1 * mySpeed;
        }

        myPos = ((myPos + speed) % worldSize + worldSize) % worldSize;


        // Check collisions
        var hitPlatform = game.physics.arcade.collide(player, platforms);

		// Move with arrow keys
		if (cursors.left.isDown) {
		    myInfo.facing = false;
			if(starSpeed < 0) starSpeed *= -1;
			if(bgSpeed < 0)	bgSpeed *= -1;
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

            player.scale.x = -4;
		}
		else if (cursors.right.isDown) {
		    myInfo.facing = true;
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
            playerface.alpha = 0;
            playerguyhair.alpha = 0;
            playergirlhair.alpha = 0;
            playershirt.alpha = 0;
            chickenBar.alpha = 1;

            player.animations.play('cwalk', cFPS, true);
            playerface.animations.stop();
            playerguyhair.animations.stop();
            playergirlhair.animations.stop();
            playershirt.animations.stop();

			starSpeed *= 1.5;
			bgSpeed *= 2;
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

            this.time.events.add(Phaser.Timer.SECOND * transformTime, this.transformBack, this);
            chickenBarIndex = transformTime - 1;
            chickenTimerLoop = this.time.events.loop(Phaser.Timer.SECOND, this.decreaseChickenBar, this);
			lastTransform = this.time.now + transformTime * 1000;

			bawk.play();

			isChicken = true;
        }
	}
}
