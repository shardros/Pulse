export class boardDesigner {
    /**
     * A class for dealing with the canvas grid
     * @param c the Canvas
     */
    constructor (c) {
        var ctx = c.getContext("2d");
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 100);
        ctx.stroke();
    }
}
