class net {
    constructor (x1,y1,x2,y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

class board {
    constructor(XLen, YLen, netList) {
        let xLen = XLen;
        let yLen = YLen;

        this.netList = netList;
        this.pcb = new Array(xLen);           //Create an array to act as our board

        for (var i = 0; i < this.pcb.length; i++) {
            /* INIT the array with the correct demensions and a large value in every square.
            This ensures that it is always bigger than the route back to the start and so 
            will never go back the wrong way */
            this.pcb[i] = new Array(yLen);
            for (var j = 0; j < board[i].length; j++) {
                this.pcb[i][j] = xLen*yLen;
            }
        }
    }
}


class router {
    constructor (board) {
        let pcb = board.pcb;

        let highDistCords, lowDistCords = [];

        maxDist = Math.pow(board.pcb.length); 

        for (var i = 0; i < pcb.length; i++) {
            for (var j = 0; j < pcb[i].length; j++) {
                pcb[i][j]
            }
        }
    }
}
