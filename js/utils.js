// random utility functions

var Splab = Splab || {};

var choose = function(list) {
    // choose a random variable from a list
    return list[Math.floor(Math.random() * list.length)];
};

var serverAddr = document.getElementById("server").value;
document.getElementById("reset").addEventListener("click", function() {
    // end the game
    console.log("HI");
    Splab.game.global.socket.emit("finished"); // clear the server
    serverAddr = document.getElementById("server").value; // reset server
    // Start game
    Splab.game.state.start('Preload');
});
document.getElementById("start").addEventListener("click", function() {
    Splab.MainMenu.prototype.sendInfo();
});


