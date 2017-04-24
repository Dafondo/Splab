var Splab = Splab || {};

var game = Splab.game = new Phaser.Game(512, 512, Phaser.CANVAS);

Phaser.Canvas.setSmoothingEnabled(this, false);

Splab.game.global = {
    menuMusic: null,
    socket: null,
    roomState: null,
    myID: -1,
    capacity: -1,
    users: [],
    size: null,
    serverAddr: "http://hatch01.cs.unc.edu:5000"
};

Splab.game.global.socket = io(Splab.game.global.serverAddr, {'forceNew':true });

Splab.game.global.socket.on('connection', function(data) {
    console.log(data);
    Splab.game.global.roomState = data.state;
    console.log(Splab.game.global);
    Splab.game.state.start("Boot");
});

Splab.game.global.socket.on('created', function(data) {
    // FIXME fix something wrong..
    console.log(data);
    Splab.game.global.myID = 0;
    Splab.game.global.capacity = data.capacity;
    Splab.game.global.users.push(data.uname);
    Splab.game.global.size = data.size;
    Splab.game.state.start('WaitScreen');
});

Splab.game.global.socket.on('joined', function(data) {
    console.log(data);
    Splab.game.global.capacity = data.capacity;
    Splab.game.global.size = data.size;
    Splab.game.global.users = data.current_users;
    console.log(Splab.game.global);
    Splab.game.state.start('WaitScreen');
});



// Add game states
Splab.game.state.add('Boot', Splab.Boot);
Splab.game.state.add('Preload', Splab.Preload);
Splab.game.state.add('MainMenu', Splab.MainMenu);
Splab.game.state.add('WaitScreen', Splab.WaitScreen);
Splab.game.state.add('MainGame', Splab.MainGame);

// Start game
// Splab.game.state.start('Boot');
