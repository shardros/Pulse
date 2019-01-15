//var ADT = require('./test')

//All all of the Cell class to be acessed from other files

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Boolean} routeable 
 */
function Cell (x,y,routeable) {
        
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
        this.routeable = (routeable === undefined ? true : routeable);

        /**
         * If the Cell has a track going through it.
         * Defaults to false because at start of day we have no tracks
         * @type {boolean}
         */
        this.tracked = false;
}


//Alow all of the Net class to be acessed from other files
/**
 * A net for a single track. 
 * This class holds the information about a single net
 * @constructor
 * @param {Cell} start The start of the net
 * @param {Cell} end   The end of the net
 */
function Net (start, end) {

    /**
     * @type {Cell}
     */
    this.startCell = start;

    /**
     * @type {Cell}
     */
    this.endCell = end;

    this.trace = new Array;
}


//Allow all of the board class to be accessed from other files

/**
 * The Class that holds all of the infomation about the board
 * @constructor
 * @param {number} boardWidth The width of the board
 * @param {number} boardHeight The height of the board 
 * @param {Array<Array<number|boolean>>} routeMask An boolean grid showing all the places that the route can not go
 */
function Board (boardWidth, boardHeight, routeMask=[[]]) {
    
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
        this.grid[y] = new Array(this.width);

        for (let x = 0; x < this.width; x++) {
            this.grid[y][x] = new Cell(x, y);
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

};

/**
 * Checks weather we can route a track through a given Cell
 * @param {Cell} Cell 
 */
Board.prototype.validCell = function (Cell) {
    return Cell.routeable 
    && (Cell.x >= 0 && Cell.x < this.width)
    && (Cell.y >= 0 && Cell.y < this.height)
    && !Cell.checked
}

/**
 * Returns a list of the Neighbours of a Cell, if the cell is valid it will return the cell's neighbours object
 * if not it will return null in the place of the list
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
Board.prototype.getNeighbours = function (Cell){

    let neighbours = new Array;

    if (this.validCell(this.grid[Cell.y + 1][Cell.x])) {
        neighbours.push(this.grid[Cell.y + 1][Cell.x]);
    };

    if (this.validCell(this.grid[Cell.y][Cell.x + 1])) {
        neighbours.push(this.grid[Cell.y][Cell.x + 1]);
    };

    if (this.validCell(this.grid[Cell.y - 1][Cell.x])) {
        neighbours.push(this.grid[Cell.y - 1][Cell.x]);
    };

    if (this.validCell(this.grid[Cell.y][Cell.x - 1])) {
        neighbours.push(this.grid[Cell.y][Cell.x - 1]);
    };

    return neighbours;
}

/**
 * Gets the manhattan distance (the smallest distance possible) between two cells
 * @param {BoardObject.Cell} cell1 Cells for distance to be found between
 * @param {BoardObject.Cell} cell2 Cells for distance to be found between
 */
Board.prototype.getManhattan = function(cell1, cell2) {
    //Pythagouses theorem to get the Manhattan distance
    return Math.sqrt(Math.pow(cell1.x-cell2.x, 2) + Math.pow(cell1.y-cell2.y, 2));
}

module.exports = {Cell, Board, Net};
