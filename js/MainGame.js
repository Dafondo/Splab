var Splab = Splab || {};

// Controls
var cursors;
var key_jump;

// Sprites
var player;
var platforms;

Splab.MainGame = function(){};

Splab.MainGame.prototype = {
	init: function() {
	},

	preload: function() {

	},
	create: function() {

		// Enable physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Create player
		player = this.game.add.sprite(32, this.game.world.height - 200, 'c');
        player.smoothed = false;
        player.scale.setTo(4);
		this.game.physics.arcade.enable(player);

		// Player physics
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 800;
		player.body.collideWorldBounds = true;

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

	},
	update: function() {
        var hitPlatform = game.physics.arcade.collide(player, platforms);
		// Reset velocity to zero
		player.body.velocity.x = 0;

		// Move with arrow keys
		if (cursors.left.isDown) {
			player.body.velocity.x = -200;
		}
		else if (cursors.right.isDown) {
			player.body.velocity.x = 200;
		}

		// Jump
		if (key_jump.isDown) {
			player.body.velocity.y -= 100; // TODO use impulse instead
		}

		// Check collisions

	}
}
