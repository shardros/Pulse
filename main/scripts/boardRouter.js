var nr = require('./netrouter');
var b = require('./board');

BoardRouter = class {
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


module.exports = BoardRouter;
