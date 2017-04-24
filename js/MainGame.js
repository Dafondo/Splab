var Splab = Splab || {};

// Controls
var cursors;
var key_jump;
var transform;

var speed = 1;

// Sprites
var stars;
var background;
var player;
var platforms;
var face;
var hair;

// Animations
var sciFPS = 12;
var cFPS = 24;
var starSpeed = -10;
var bgSpeed = -20;

// Timers
var transformTime = 3;
var lastTransform = 0;
var cooldown = 3000;

Splab.MainGame = function(){};

Splab.MainGame.prototype = {
	init: function() {
	},

	preload: function() {

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

		// Create animations
        sciwalk = player.animations.add('sciwalk', [0, 1, 2, 3, 4, 5, 6, 7]);
        cwalk = player.animations.add('cwalk', [8, 9, 10, 11, 12, 13, 14, 15]);
        faceBounce = face.animations.add('bounce');
        hairBounce = hair.animations.add('bounce');
        shirtBounce = shirt.animations.add('bounce');

		// Play animations
        player.animations.play('sciwalk', sciFPS, true);
        face.animations.play('bounce', sciFPS, true);
        hair.animations.play('bounce', sciFPS, true);
        shirt.animations.play('bounce', sciFPS, true);

		// Player physics
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 800;
		player.body.collideWorldBounds = true;
        /*player.body.velocity.x = 200;*/

		// Player animations
		// player.animations.add('left', [0, 1, 2, 3], 10, true);
		// player.animations.add('right', [5, 6, 7, 8], 10, true);

		// Create platforms that the player can walk on
		platforms = this.game.add.group();
		platforms.enableBody = true;
		ground = [platforms.create(0, this.game.world.height - 20, 'splabfloor'), platforms.create(512, this.game.world.height - 20, 'splabfloor'), platforms.create(1024, this.game.world.height - 20, 'splabfloor'), platforms.create(1536, this.game.world.height - 20, 'splabfloor')];
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


        this.camera.follow(player);


	},
    transformBack: function() {
        face.tint = Math.random() * 0xffffff;
        hair.tint = Math.random() * 0xffffff;
        shirt.tint = Math.random() * 0xffffff;

        face.alpha = 1;
        hair.alpha = 1;
        shirt.alpha = 1;

        face.animations.play('bounce', sciFPS, true);
        hair.animations.play('bounce', sciFPS, true);
        shirt.animations.play('bounce', sciFPS, true);
        player.animations.play('sciwalk', sciFPS, true);

		/*player.body.velocity.x /= speed;*/
        starSpeed /= 1.5;
		bgSpeed /= 2;

		stars.autoScroll(starSpeed, 0);
		background.autoScroll(bgSpeed, 0);

    },
	update: function() {
        // Check collisions
        var hitPlatform = game.physics.arcade.collide(player, platforms);
		// Reset velocity to zero
		// player.body.velocity.x = 0;

		// Move with arrow keys
		if (cursors.left.isDown) {
			/*player.body.velocity.x = -200*speed;*/
			if(starSpeed < 0) {
				starSpeed *= -1;
			}
			if(bgSpeed < 0) {
				bgSpeed *= -1;
			}
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

            player.scale.x = -4;
		}
		else if (cursors.right.isDown) {
			/*player.body.velocity.x = 200*speed;*/
			if(starSpeed > 0) {
				starSpeed *= -1;
			}
			if(bgSpeed > 0) {
				bgSpeed *= -1;
			}
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

            player.scale.x = 4;
		}

		// Jump
		if (key_jump.isDown) {
			player.body.velocity.y -= 100; // TODO use impulse instead
		}

        // Transform
        if(transform.isDown && lastTransform + cooldown < this.time.now) {
            face.alpha = 0;
            hair.alpha = 0;
            shirt.alpha = 0;
            // player.animations.stop();
            player.animations.play('cwalk', cFPS, true);
            face.animations.stop();
            hair.animations.stop();
            shirt.animations.stop();

			starSpeed *= 1.5;
			bgSpeed *= 2;
			stars.autoScroll(starSpeed, 0);
			background.autoScroll(bgSpeed, 0);

			/*player.body.velocity.x *= speed;*/
            this.time.events.add(Phaser.Timer.SECOND * transformTime, this.transformBack, this);
			lastTransform = this.time.now + transformTime * 1000;
        }
	}
}
