var Splab = Splab || {};

var game = Splab.game = new Phaser.Game(800, 512, Phaser.AUTO);

Splab.game.global = {
    menuMusic: null
}

// Add game states
Splab.game.state.add('Boot', Splab.Boot);
Splab.game.state.add('Preload', Splab.Preload);
Splab.game.state.add('MainMenu', Splab.MainMenu);
Splab.game.state.add('MainGame', Splab.MainGame);

// Start game
Splab.game.state.start('Boot');
