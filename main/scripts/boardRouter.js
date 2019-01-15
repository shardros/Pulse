var nr = require('./netrouter');
var b = require('./board');

/**
 * The class for routing a whole board
 * @param {Array<Array<Board.Cell>>} board 
 * @param {Array<Board.Net>} netList 
 */
BoardRouter = function (board, netList) {
    this.board = board;
    this.netList = netList;
}

/**
 * A class to decide which order the nets are to be routed in
 */
BoardRouter.prototype.route = function() {
    let tracks = new Array;
    for (var i = 0; i < this.netList.length; i++) {
        let myNetRouter = new NetRouter(this.board, this.netList[i], 2);
        tracks.push(myNetRouter.route());
    }

    return tracks;
}



module.exports = {BoardRouter};
