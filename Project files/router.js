var BoardObject = require('./board');
var ADT = require('./test');

class netRouter {
    /**
     * A class for performing the routing of a net. A board of where the net can go is passed to it
     * and it will return the path the net will be routed along.
     * @param {Array<Array<Board>>} board A board conataining all the tracks that aren't routed.  
     * @param {Net} net The net to be routed
     */
    constructor(board, net) {   
        this.board = board;

        var searched = new PriorityQueue();
        
        //Add the starting point of the route to our list searched nodes.
        net.startCell.distanceToStart = 0;

        searched.enqueue(net.startCell);
    }
    
    /**
     * The function that performs the path finding for a single net
     * @param {Net} net 
     */
    route(net) {
        getNeighbours(searched.dequeue)
    }
}

board = new Board(10,10);

start = new Cell(2,2);
end = new Cell(7,7);

net = new Net(start, end);

foo = new netRouter(board, net);