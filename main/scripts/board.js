class Cell {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} layer
     * @param {Boolean} routeable 
     */
    constructor (x,y,layer=1,routeable=true) {
        
        /**
         * @type {number}
         */
        this.x = x;
        
        /**
         * @type {number}
         */
        this.y = y;

        /**
         * This can be deleted now
         * @type {number}
         */
        this.layer = layer;

        /**
         * @type {boolean}
         */
        this.routeable = routeable;

        this.hardRouteable = true;
        /**
         * If the Cell has a track going through it.
         * Defaults to false because at start of day we have no tracks
         * @type {boolean}
         */
        this.tracked = false;

        this.controllingNet = new Array;
        
        this.hardControllingNetID = new Array;
    }
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
 * !This is the Euclidian length need to refactor
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

Board.prototype.validCord = function (x,y) {
    return this.grid[y][x].routeable && !this.grid[y][x].checked
}


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
        && this.grid[Cell.y + 1][Cell.x].routeable) {
        
            neighbours.push(this.grid[Cell.y + 1][Cell.x]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y + 1)
        && this.grid[Cell.y][Cell.x + 1].routeable) {
        
            neighbours.push(this.grid[Cell.y][Cell.x + 1]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y -1)
        && this.grid[Cell.y - 1][Cell.x].routeable) {
        
            neighbours.push(this.grid[Cell.y - 1][Cell.x]);
    };

    if (this.CordsOnBoard(Cell.x, Cell.y - 1)
        && this.grid[Cell.y][Cell.x - 1].routeable) {
        
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
 * It then specifies the reason why they are not routeable and the level
 * of overide required to make it routebale
 */
Board.prototype.markNeighboursAsUnrouteable = function(Cell, diagonals=false, NetID=null, overide=0) {
    this.getNeighbours(Cell, diagonals).forEach((neighbour) => {
        this.markCellAsUnrouteable(neighbour,NetID,overide); 
    });
}

/**
 * @param {*} Cell 
 * @param {*} diagonals 
 * @param {*} ID 
 */
Board.prototype.markNeighboursAsRouteable = function(Cell, diagonals=false, ID, overide=0) {
    this.getNeighbours(Cell, diagonals).forEach(neighbour => {
        this.markCellAsRouteable(neighbour,ID,overide)
    },this);
};

Board.prototype.markCellAsRouteable = function(cell, ID=null, overide) {
    /**Need to check weather this is the only net that
     * Controlls this cell, if not then we don't want to
     * remove it from this nets trace
     * 
     * If it is the only one we remove it from the controlling array
     * 
     * If the controlling array is then empty then we the demark it
     */     
    for (let i = 0; i < cell.controllingNet.length; i++) {
        if (cell.controllingNet[i].controllingNetID == ID) { 
            if (overide >= cell.controllingNet[i].overide) {
                cell.controllingNet.splice(i, 1);
                
                if (cell.controllingNet.length == 0) {
                    cell.routeable = true;
                };
            };

            break; //No point to continue itteration
        }
    }
}

Board.prototype.markCellAsUnrouteable = function(cell, ID=null, overide=0) {
    //Convert to set
    for (let i = 0; i < cell.controllingNet.length; i++) {
        if (cell.controllingNet[i].controllingNetID == ID)   {
            if (cell.controllingNet[i].controllingNetID < overide) {
                cell.controllingNet[i].controllingNetID = overide;
                cell.routeable = false;
            } 
            return;
        }
    }

    //Not in list
    cell.controllingNet.push({
        controllingNetID: ID,
        overide: overide
    })
    cell.routeable = false;
}

//!This should be removed but needs to have uses removed first
Board.prototype.markCordsAsUnrouteable = function(x,y, ID=null, overide=0) {
    this.markCellAsUnrouteable(this.getCell(x,y),ID, overide);   
}


Board.prototype.markCordsAsTracked = function(x,y) {
    this.grid[y][x].tracked = true;
}

Board.prototype.markCellAsUntracked = function(cell) {
    cell.tracked = false;
}

Board.prototype.getCell = function(x,y) {
    try {
        return this.grid[y][x];
    } catch (err) {
        if (err.message == "TypeError") {
            throw new err ("Cords not on Board")
        } else { 
            throw err
        }
    }
}


module.exports = {Cell, Board, Net};

