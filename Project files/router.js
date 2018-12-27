var BoardObject = require('./board');
var ADT = require('./test');
var Heap = require('heap');

class netRouter {
    /**
     * A class for performing the routing of a net. A board of where the net can go is passed to it
     * and it will return the path the net will be routed along.
     * @param {Array<Array<Board>>} board A board conataining all the tracks that aren't routed.  
     * @param {Net} net The net to be routed
     * @param {Number} heuristicWeight the weight of the heuristic
     */
    constructor(board, net, heuristicWeight) {   
        this.board = board;
        this.net = net;
        this.heuristicWeight = heuristicWeight; 

        this._toCheck = new Heap(function(cellA, cellB) {
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
        
        this._toCheck.push(net.startCell);

        while (!this._toCheck.empty()) {
            
            let cell = this._toCheck.pop();

            console.log(cell)
            
            cell.checked = true;

            if (cell.x == this.endCell.x && this.endCell.y == cell.y) {
                console.log('routed');
                let current = cell;
                console.log(current);
                do {
                    current = current.super;
                    console.log(current);
                } while (current.x != this.startCell.x || current.y != this.startCell.y)

                return 
                
            }

            let neighbours = B.getNeighbours(cell);

            let neightbourLength = neighbours.length;
            for (let i = 0; i < neightbourLength; i++) {

                let neighbour = neighbours[i];
                let ng = cell.g + 1;

                if (neighbour.checked) {
                    continue; //Break for one iteration of the for loop
                }
                
                if (!neighbour.checked || ng < neighbour.g) {
                    neighbour.super = cell;
                    
                    neighbour.g = ng;
                    neighbour.h = this.heuristicWeight * B.getManhattan(neighbour, this.endCell); 
                    neighbour.f = neighbour.g + neighbour.h;
                    
                    neighbour.checked = true;
                                      
                    this._toCheck.push(neighbour);
                } 
            }
        }
    }
}

board = new Board(10,10);

start = new Cell(2,2);
end = new Cell(7,3);

net = new Net(start, end);

netRouter = new netRouter(board, net, 1);

netRouter.route();