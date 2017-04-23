var Splab = Splab || {};

// Controls
var cursors;
var key_jump;
var transform;

var speed = 1;

// Sprites
var player;
var platforms;
var face;
var hair;

// Animations
var sciFPS = 12;
var cFPS = 24;

Splab.MainGame = function(){};

Splab.MainGame.prototype = {
	init: function() {
	},

	preload: function() {

	},
	create: function() {
        game.add.tileSprite(0, 0, 1920, 1920, 'background');

        game.world.setBounds(0, 0, 1920, 1920);

		// Enable physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Create player
		player = this.game.add.sprite(game.world.centerX-48, this.game.world.height - 200, 'allwalk');
        player.anchor.set(0.5, 0.5);
        player.smoothed = false;
        player.scale.setTo(4);
		this.game.physics.arcade.enable(player);

        face = this.make.sprite(0, 0, 'sciface');
        face.anchor.set(0.5, 0.5);
        face.smoothed = false;
        face.tint = Math.random() * 0xffffff;
        player.addChild(face);

        hair = this.make.sprite(0, 0, 'guyhair');
        hair.anchor.set(0.5, 0.5);
        hair.smoothed = false;
        hair.tint = Math.random() * 0xffffff;
        player.addChild(hair);

        shirt = this.make.sprite(0, 0, 'scishirt');
        shirt.anchor.set(0.5, 0.5);
        shirt.smoothed = false;
        shirt.tint = Math.random() * 0xffffff;
        player.addChild(shirt);

        sciwalk = player.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
        cwalk = player.animations.add('cwalk', [8, 9, 10, 11, 12, 13, 14, 15]);
        faceBounce = face.animations.add('bounce');
        hairBounce = hair.animations.add('bounce');
        shirtBounce = shirt.animations.add('bounce');

        player.animations.play('sciwalk', sciFPS, true);
        face.animations.play('bounce', sciFPS, true);
        hair.animations.play('bounce', sciFPS, true);
        shirt.animations.play('bounce', sciFPS, true);
		// Player physics
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 800;
		player.body.collideWorldBounds = true;
        player.body.velocity.x = 200;

		// Player animations
		// player.animations.add('left', [0, 1, 2, 3], 10, true);
		// player.animations.add('right', [5, 6, 7, 8], 10, true);

		// Create platforms that the player can walk on
		platforms = this.game.add.group();
		platforms.enableBody = true;

		// Create ground and platforms
		var ground = platforms.create(0, this.game.world.height - 64, 'platform');
		ground.scale.setTo(2, 2); // scale to width of the game
		ground.body.immovable = true;
		var ledges = [ platforms.create(400, 400, 'platform'), platforms.create(-150, 250, 'platform') ];
		ledges.forEach((ledge) => ledge.body.immovable = true);


		// Create cursor keys
		cursors = this.game.input.keyboard.createCursorKeys();
		key_jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        transform = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);

        this.camera.follow(player);


	},
    transformBack: function() {
        face.alpha = 1;
        hair.alpha = 1;
        shirt.alpha = 1;
        face.animations.play('bounce', sciFPS, true);
        hair.animations.play('bounce', sciFPS, true);
        shirt.animations.play('bounce', sciFPS, true);
        player.animations.play('sciwalk', sciFPS, true);
        speed = 1;
    },
	update: function() {
        // Check collisions
        var hitPlatform = game.physics.arcade.collide(player, platforms);
		// Reset velocity to zero
		// player.body.velocity.x = 0;

		// Move with arrow keys
		if (cursors.left.isDown) {
			player.body.velocity.x = -200*speed;
            player.scale.x = -4;
		}
		else if (cursors.right.isDown) {
			player.body.velocity.x = 200*speed;
            player.scale.x = 4;
		}

		// Jump
		if (key_jump.isDown) {
			player.body.velocity.y -= 100; // TODO use impulse instead
		}

        // Transform
        if(transform.isDown) {
            face.alpha = 0;
            hair.alpha = 0;
            shirt.alpha = 0;
            // player.animations.stop();
            player.animations.play('cwalk', cFPS, true);
            face.animations.stop();
            hair.animations.stop();
            shirt.animations.stop();
            speed = 2;
            this.time.events.add(Phaser.Timer.SECOND * 3, this.transformBack, this);
        }



	}
}
