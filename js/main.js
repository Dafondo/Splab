var Splab = Splab || {};


var game = Splab.game = new Phaser.Game(512, 512, Phaser.CANVAS);

Phaser.Canvas.setSmoothingEnabled(this, false);

Splab.game.global = {
    music: null,
    socket: null,
    roomState: null,
    myID: -1,
    capacity: -1,
    users: [],
    size: null,
    state: null // state of entire game, set at start
};

Splab.game.stage.disableVisibilityChange=true;

// Add game states
Splab.game.state.add('Boot', Splab.Boot);
Splab.game.state.add('Preload', Splab.Preload);
Splab.game.state.add('MainMenu', Splab.MainMenu);
Splab.game.state.add('WaitScreen', Splab.WaitScreen);
Splab.game.state.add('MainGame', Splab.MainGame);

// Start game
Splab.game.state.start('Boot');
