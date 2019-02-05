//var ADT = require('./test')

//All all of the Cell class to be acessed from other files

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} layer
 * @param {Boolean} routeable 
 */
function Cell (x,y,layer=1,routeable=true) {
        
        /**
         * @type {number}
         */
        this.x = x;
        
        /**
         * @type {number}
         */
        this.y = y;

        /**
         * @type {number}
         */
        this.layer = layer;

        /**
         * @type {boolean}
         */
        this.routeable = routeable;
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

/**
 * This maybe too similar to the get manhattan distance board method
 * and theere may be a way of subcalssing these to make more sense
 */
Net.prototype.manhattanLength = function() {
    return Math.sqrt(Math.pow(this.startCell.x-this.endCell.x, 2) + Math.pow(this.startCell.y-this.endCell.y, 2));

}

//Allow all of the board class to be accessed from other files

/**
 * The Class that holds all of the infomation about the board
 * @constructor
 * @param {number} boardWidth The width of the board
 * @param {number} boardHeight The height of the board 
 * @param {Array<Array<number|boolean>>} routeMask An boolean grid showing all the places that the route can not go
 */
var Board = function(boardWidth, boardHeight, routeMask=[[]]) {
        
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
 * Checks if a cell is on the board
 * @param {Cell} Cell 
 */
Board.prototype.CordsOnBoard = function(x ,y) {
    return (x >= 0 && x < this.width)
    && (y >= 0 && y < this.height);
}

/**
 * Checks weather we can route a track through a given Cell
 * @param {Cell} Cell 
 */
Board.prototype.validCell = function (Cell) {
    return Cell.routeable && !Cell.checked
}

Board.prototype.validCord = function (x,y) {
    return this.grid[y][x].routeable && !this.grid[y][x].checked
}


/**
 * TODO:
 * ?Maybe use this to make the rest of the methods in this class functional using reduce
 * ?Need to ensure though that we do not hit a significant performace penalty
 */
Board.prototype.getNeighbours = function(Cell, diagonals) {
    let neighbours = new Array;

    if (this.CordsOnBoard(Cell.x + 1, Cell.y)) {
        neighbours.push(this.grid[Cell.y + 1][Cell.x]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y + 1)) {
        neighbours.push(this.grid[Cell.y][Cell.x + 1]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y -1)) {
        neighbours.push(this.grid[Cell.y - 1][Cell.x]);
    };

    if (this.CordsOnBoard(Cell.x - 1, Cell.y)) {
        neighbours.push(this.grid[Cell.y][Cell.x - 1]);
    };
    
    if (diagonals) {
        if (this.CordsOnBoard(Cell.x + 1, Cell.y + 1)) {
            neighbours.push(this.grid[Cell.y + 1][Cell.x + 1]);
        };
    
        if (this.CordsOnBoard(Cell.x - 1, Cell.y + 1)) {
            neighbours.push(this.grid[Cell.y + 1][Cell.x - 1]);
        };
    
        if (this.CordsOnBoard(Cell.x + 1, Cell.y -1)) {
            neighbours.push(this.grid[Cell.y - 1][Cell.x + 1]);
        };
    
        if (this.CordsOnBoard(Cell.x - 1, Cell.y - 1)) {
            neighbours.push(this.grid[Cell.y - 1][Cell.x - 1]);
        };    
    } 

    return neighbours
}

/**
 * Returns a list of the Neighbours of a Cell, if the 
 * cell is valid it will return the cell's neighbours object
 * @param {Cell} Cell 
 */
Board.prototype.getValidNeighbours = function (Cell){

    let neighbours = new Array;

    if (this.CordsOnBoard(Cell.x + 1, Cell.y)
        && this.validCell(this.grid[Cell.y + 1][Cell.x])) {
        
            neighbours.push(this.grid[Cell.y + 1][Cell.x]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y + 1)
        && this.validCell(this.grid[Cell.y][Cell.x + 1])) {
        
            neighbours.push(this.grid[Cell.y][Cell.x + 1]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y -1)
        && this.validCell(this.grid[Cell.y - 1][Cell.x])) {
        
            neighbours.push(this.grid[Cell.y - 1][Cell.x]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y - 1)
        && this.validCell(this.grid[Cell.y][Cell.x - 1])) {
        
            neighbours.push(this.grid[Cell.y][Cell.x - 1]);
    };

    return neighbours;
}

/**
 * Gets the neighbours of a cell including diagonals
 * @param {Cell} Cell
 */
Board.prototype.getCellAndAllNeighbours = function(Cell) {
    let cells = new Array

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            
            if (this.CordsOnBoard(Cell.x + x,Cell.y + y)
            && !(x == 0 && y == 0)) {
                cells.push(this.grid[Cell.y + y][Cell.x + x]);
            }
        }
    }
    
    return cells;
}

/**
 * Gets the manhattan distance between two cells
 * @param {BoardObject.Cell} cell1 Cells for distance to be found between
 * @param {BoardObject.Cell} cell2 Cells for distance to be found between
 */
Board.prototype.getManhattan = function(cell1, cell2) {
    //Pythagouses theorem to get the Manhattan distance
    return (Math.abs(cell1.x-cell2.x) + Math.abs(cell1.y-cell2.y));
}

/**
 * 
 * @param {BoardObject.Cell} cell1 
 * @param {BoardObject.Cell} cell2 
 */
Board.prototype.getEuclidean = function(cell1, cell2) {
    return Math.sqrt(Math.pow(cell1.x-cell2.x, 2) + Math.pow(cell1.y-cell2.y, 2));
}

/**
 * Finds all of the cells which are neighbours (that are also on the)
 * board and marks them and all of their neighours as not routeable.
 */
Board.prototype.markNeighboursAsUnrouteable = function(Cell, diagonals=false) {
    this.getNeighbours(Cell, diagonals).forEach(neighbour => {neighbour.routeable = false});
}

Board.prototype.markNeighboursAsRouteable = function(Cell, diagonals=false) {
    this.getNeighbours(Cell, diagonals).forEach(neighbour => {neighbour.routeable = true});
}

Board.prototype.markCordsAsUnrouteable = function(x,y) {
    this.grid[y][x].routeable = false;
}

Board.prototype.markCordsAsTracked = function(x,y) {
    this.grid[y][x].tracked = true;
}

Board.prototype.getCell = function(x,y) {
    return this.grid[y][x];
}


module.exports = {Cell, Board, Net};

