var Splab = Splab || {};

Splab.WaitScreen = function(){};

var playersText;
var sizeText;

Splab.WaitScreen.prototype = {
    init: function() {

    },
    preload: function() {
        console.log("HIIIII");
        Splab.game.global.socket.on('join', function(data) {
            console.log(data.uname + " has joined");
            Splab.game.global.users.push(data.uname);
            playersText.text = "Players joined: " + Splab.game.global.users.length + "/" + Splab.game.global.capacity;
        });
   },
    create: function() {
        text = "Players joined: " + Splab.game.global.users.length + " / " + Splab.game.global.capacity
        var style = { font: "12px Arial", fill: "#fff" };
        playersText = this.game.add.text(100, 50, text, style);
        playersText.anchor.set(0.5);
        playersText.stroke = "#000000";
        playersText.strokeThickness = 2;

        text = "Game size: " + Splab.game.global.size
        var style = { font: "12px Arial", fill: "#fff" };
        sizeText = this.game.add.text(100, 80, text, style);
        sizeText.anchor.set(0.5);
        sizeText.stroke = "#000000";
        sizeText.strokeThickness = 2;
    },
    update: function() {
    }
}
