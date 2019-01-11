var nr = require('./netrouter');
var b = require('./board');

class BoardRouter {
    /**
     * The class for routing a whole board
     * @param {Array<Array<Board.Cell>>} board 
     * @param {Array<Board.Net>} netList 
     */
    constructor (board, netList) {
        this.board = board;
        this.netList = netList;
    }

    route() {
        let tracks = new Array;
        for (var i = 0; i < this.netList.length; i++) {
            let myNetRouter = new NetRouter(this.board, this.netList[i], 2);
            tracks.push(myNetRouter.route());
        }

        return tracks;
    }
}

module

var size = 10;

board = new Board(size,size);

start = board.grid[2][2];
end = board.grid[4][4];

net = new Net(start, end);

netlist = [net];

BoardRouter = new BoardRouter(board, netlist);

tracks = BoardRouter.route();

for (let i = 0; i < tracks.length; i++) {
    for (let j = 0; j < tracks[i].length; j++) {

    }
}

