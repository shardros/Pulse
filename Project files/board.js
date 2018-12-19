import {PriorityQueue} from 'adt';

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
     * @constructor
     * @param {Cell} start The start of the net
     * @param {Cell} end   The end of the net
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
     * @param {number} boardWidth The width of the board
     * @param {number} boardHeight The height of the board 
     * @param {Array<Array<number|boolean>>} routeMask An boolean grid showing all the places that the route can not go
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
        return Cell.routeable && (cell.x >= 0 && cell.x < this.width) && (cell.y >= 0 && cell.y < this.height)
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
    getNeighbours(Cell) {

        neighbours = [null,null,null,null];
        
        if (this.validCell(this.grid[cell.y + 1][cell.x])) {
            neighbours[0] = this.grid[cell.y + 1][cell.x]
        };

        if (this.validCell(this.grid[cell.y][cell.x + 1])) {
            neighbours[1] = this.grid[cell.y][cell.x + 1]
        };

        if (this.validCell(this.grid[cell.y - 1][cell.x])) {
            neighbours[2] = this.grid[cell.y - 1][cell.x]
        };

        if (this.validCell(this.grid[cell.y][cell.x + 1])) {
            neighbours[3] = this.grid[cell.y][cell.x + 1]
        };
    }
}

