class Cell {
    /**
     * A Cell in the grid
     * This class holds the information about a single Cell on the grid
     * @param {number} x            The Cells x position on the grid
     * @param {number} y            The Cells y position on the grid
     * @param {boolean} routeable   Can a track pass through this Cell?
     */
    constructor (x,y,routeable) {
        
        /**
         * @type {number}
         */
        this.x = x;
        
        /**
         * @type {number}
         */
        this.y = y;

        /**
         * @type {boolean}
         */
        this.routeable = (routeable === undefined ? true : walkable);

        /**
         * If the Cell has a track going through it.
         * Defaults to false because at start of day we have no tracks
         * @type {boolean}
         */
        this.tracked = false;
    }
}

class Net {
    /**
     * A net for a single track. 
     * This class holds the information about a single net
     * @param {Cell} start 
     * @param {Cell} end 
     */
    constructor (start, end) {

        /**
         * @type {Cell}
         */
        this.startCell = start;

        /**
         * @type {Cell}
         */
        this.endCell = end;
    }
}

class Board {
    /**
     * The Class that holds all of the infomation about the board
     * @constructor
     * @param {number} boardWidth 
     * @param {number} boardHeight
     * @param {Array<Array<number|boolean>>} routeMask 
     */
    constructor(boardWidth, boardHeight, routeMask) {
        
        /**
         * @type {number}
         */
        this.width = boardWidth;
        
        /**
         * @type {number}
         */
        this.height = boardHeight;

        /**Create a matrix for the grid to be stored in then go through and 
         * populate it with cells
         */        

        this.grid = new Array(this.height);

        for (let y = 0; y < this.height; y++) {
            grid[y] = new Array(this.width);

            for (let x = 0; x < this.width; x++) {
                grid[y][x] = new Cell(x, y);
            }

        }

        /**
         * Check if each of the cells are routeable according to the inputted routing guide.
         */

        if ((routeMask != undefined)
        && (routeMask.length > this.height)
        && (routeMask[0].length > this.width)) {

            //NOTE TO SELF - Possibly look at merging this and the for loop above together

            for (let y = 0; y < routeMask.length; y++) {
                for (let x = 0; x < routeMask[y].length; x++) {
                    if (routeMask[x][y] = 1) grid[y][x].routeable = false;
                }
            } 
        }

    }

    /**
     * Checks weather we can route a track through a given Cell
     * @param {Cell} Cell 
     */
    validCell(Cell) {
        return Cell.routeable && (x >= 0 && x < this.width) && (y >= 0 && y < this.height)
    }

    /**
     * Gets the valid Neighbours of a Cell
     * The function returns an list with the indexs as follows.
     * 
     * +---+---+---+
     * |   | 0 |   |
     * +---+---+---+
     * | 3 | X | 1 |
     * +---+---+---+
     * |   | 2 |   |
     * +---+---+---+
     * 
     * @param {Cell} Cell 
     */
    getNeighbours(Cell) {
        
    }
}
