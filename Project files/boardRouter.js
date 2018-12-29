var NetRouter = require('./netrouter');
var Board = require('./board');

class BoardRouter {
    /**
     * The class for routing a whole board
     * @param {Array<Array<Board.Cell>>} board 
     * @param {Array<Board.Net>} netList 
     */
    constructor (board, netList) {
        this.board = board;
        this.netlist = netList;
    }

    route() {

    }
}

board = new Board(10,10);

start = new Cell(2,2);
end = new Cell(4,4);

net = new Net(start, end);

netlist = [net];

BoardRouter = new BoardRouter(board, netlist);

console.log(BoardRouter.route());