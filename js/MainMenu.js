var Splab = Splab || {};

Splab.MainMenu = function(){};

Splab.MainMenu.prototype = {
    init: function() {
    },
    preload: function() {

    },
    create: function() {
    },
    update: function() {
        this.game.state.start('MainGame');
    }
};
