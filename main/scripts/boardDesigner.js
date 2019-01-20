class BD {
    /**
     * A class for dealing with the canvas grid
     * @param c the Canvas
     */
    constructor (c) {
        //Make this a private property
        this.c = c;
        this.ctx = this.c.getContext("2d");


        for (let x = 0; x < c.width; x += gridSize) {
            for (let y = 0; y < c.height; y += gridSize) {
                this.ctx.rect(x, y, gridSize, gridSize);
                this.ctx.stroke();
            }
        }
    }

    makeFullScreen(context) {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }

    getMousePos(evt) {
        var rect = this.c.getBoundingClientRect(), // abs. size of element
            scaleX = this.c.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = this.c.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    drawRect(x, y, xLen, yLen, fillColour = new Colour(255,255,255), boarderColour = new Colour(0,0,0)) {
        this.ctx.fillStyle = fillColour.toHexString();
        this.ctx.fillRect (x, y, xLen, yLen);
    }
}
