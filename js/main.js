var Splab = Splab || {};

Splab.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

Splab.game.global = {
    menuMusic: null
}

Splab.game.state.add('Boot', Splab.Boot);
Splab.game.state.add('Preload', Splab.Preload);
Splab.game.state.add('MainMenu', Splab.MainMenu);
Splab.game.state.add('MainGame', Splab.MainGame);
Splab.game.state.start('Boot');
