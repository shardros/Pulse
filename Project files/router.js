var BoardObject = require('./board');
var ADT = require('./test')

class netRouter {
    /**
     * A class for performing the routing of a net. A board of where the net can go is passed to it
     * and it will return the path the net will be routed along.
     * @param {Array<Array<BoardObject.Board>>} board A board conataining all the tracks that aren't routed.  
     * @param {BoardObject.Net} net The net to be routed
     */
    constructor(board, net) {
        this.board = board;
        
        searched = new PriorityQueue();

        //Add the starting point of the route to our list searched nodes.
        searched.push(net.startCell);
    }

    /**
     * The function that performs the path finding for a single net
     * @param {BoardObject.Net} net 
     */
    route(net) {
        getNeighbours(searched.pop)
    }
}
