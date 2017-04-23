var socket = io.connect("http://localhost:5000");
var myID; // id of current player
var capacity; // capacity of game (number of players)

socket.on('connection', function(data) {
    // TODO
    // happens right after connection, data = {'state': <server state>}
    // state is either 'empty'   in which case you should create
    //                 'full'    game at full capacity
    //                 'waiting' waiting for all players to join
    // after this client wants to emit signal to join or create
    console.log(data);
});

socket.on('start', function() {
    // TODO all players join, start the game
    console.log('start');
});

socket.on('created', function(data) {
    // TODO room created
    // data is a dictionary with fields of
    //     'uname' = username of the creator (probably you)
    //     'capacity' = capacity of room
    //     'size' = size of game created
    console.log(data);
});

socket.on('joined', function(data) {
    // TODO successfully joined a game
    // data is a dictionary with fields of
    //     'capacity' = capacity of room
    //     'size' = size of game created
    //     'current_users' = list of tuple of users in ('uname', id)
    // find your own user id by identifying which one has the same uname as you
    console.log(data);
});

socket.on('join', function(data) {
    // TODO sent when a new player joins
    // data is a dictionary with fields of
    //     'uname': name of the new user
    //     'id': id of the new user
    // XXX should only matter **after** created or joined
});

socket.on('action', function(data) {
    // TODO
    // server sends action data
    // data fields:
    //  'id': the id the player
    //  'act': action, can be
    //      'change_direction'
    //      'dies'
    //      'transforms'
    //      'kills'
    //      'run'
    //  'target': only available if act is kill, the targetID of the killing
    console.log(data);
});

var create_room = function(uname, capacity, size) {
    socket.emit('create', {'uname': uname,
                           'capacity': capacity,
                           'size': size});
};

var join = function(uname) {
    socket.emit('join', uname);
};
