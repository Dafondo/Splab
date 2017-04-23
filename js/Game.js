let Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    /* For pixel art */
    /*
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    */
    this.lastFrameTimeMs = 0;

    this.gameLoop = (timestamp) => {
        var delta = timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;
        this.update(delta);
        this.draw();
        window.requestAnimationFrame(this.gameLoop);
    }

    this.update = (delta) => {
    }

	this.draw = () => {
		// Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

    window.requestAnimationFrame(this.gameLoop);
};
