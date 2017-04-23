const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const SCALE = 30;

let game;

function init() {
    let canvas = document.getElementById("game");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
    game = new Game(canvas);
}

init();
requestAnimationFrame(game.gameLoop);
