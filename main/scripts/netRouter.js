var BoardObject = require('./board');
//var ADT = require('./test');
var Heap = require('../Modules/Heap');

NetRouter = class {
    /**
     * A class for performing the routing of a net. A board of where the net can go is passed to it
     * and it will return the path the net will be routed along.
     * @param {Array<Array<Cell>>} board A board conataining all the tracks that aren't routed.  
     * @param {Net} net The net to be routed
     * @param {Number} heuristicWeight the weight of the heuristic
     */
    constructor(board, net, heuristicWeight, ID) {   
        this.board = board;
        this.net = net;
        this.heuristicWeight = heuristicWeight;
        this.ID = ID; 

        /** Create a new heap which sorts the entities by the difference in their f values,
         *  where f = g + h
         *  g - Shortest known path from start
         *  h - Manhattan distance
         */ 
        this.toCheck = new Heap(function(cellA, cellB) {
            return cellA.f - cellB.f;
        })
        
        //Add the starting point of the route to our list toCheck nodes.
        this.startCell = this.net.startCell;
        this.endCell = this.net.endCell;                
    }
    
    /**
     * The function that performs the path finding for a single net 
     */
    route() {
        let B = this.board;
        
        this.startCell.g = 0;
        this.startCell.f = 0;

        this.startCell.checked = true;

        B.markNeighboursAsRouteable(this.startCell,true,this.ID,1);
        B.markNeighboursAsRouteable(this.endCell,true,this.ID,1);


        this.toCheck.push(this.net.startCell);


        //While there are still possible cells that there could be a route for.
        while (!this.toCheck.empty()) {
            
            let cell = this.toCheck.pop();
            cell.checked = true;
            
            //Have we found the endCell yet?
            if (cell.x == this.endCell.x && this.endCell.y == cell.y) {
                
                let current = cell; 

                B.markNeighboursAsUnrouteable(current, true, this.ID, 1);

                this.net.trace.push(current);
                
                /** Starting from the endCell perform a trace back to
                 *  the start, adding the cells that are on the trace to a list and marking 
                 *  all of the neighbours as unrouteable
                 */ 
                do {
                    B.markNeighboursAsUnrouteable(current, true, this.ID, 0);
                    
                    current = current.super;
                    
                    current.tracked = true;
                    this.net.trace.push(current);
                    
                } while (current != this.startCell)
                
                B.markNeighboursAsUnrouteable(this.startCell, true, this.ID, 1);

                let n = B.getNeighbours(this.startCell);

                this.cleanUp();
                
                return this.net.trace
                
            }

            /**We've not found the end yet.
             * Lets work out work out which cell to expand into next
             */
            let neighbours = B.getValidNeighbours(cell);
            
            let neightbourLength = neighbours.length;
            for (let i = 0; i < neightbourLength; i++) {
                
                let neighbour = neighbours[i];
                let ng = cell.g + 1; //neighbough g -> ng

                //Is there a route to that cell that we don't know about
                if (ng < neighbour.g || !neighbour.checked) {
                    neighbour.super = cell;
                    
                    
                    neighbour.g = ng;
                    neighbour.h = this.heuristicWeight * B.getEuclidean(neighbour, this.endCell); 
                    neighbour.f = neighbour.g + neighbour.h;

                    neighbour.checked = true;
                                      
                    this.toCheck.push(neighbour);
                } 
            }
        }

        this.cleanUp()

        throw Error("No route found");
        
    }

    cleanUp() {
        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                let cell = this.board.getCell(x,y); 
                cell.checked = false;
                cell.super = null;
            }
        }
    }

    reset() {
        this.net.trace = new Array;
    }

    
}

module.exports = {NetRouter};