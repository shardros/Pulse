class net {
    constructor (x1,y1,x2,y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

class Board {
    constructor(XLen, YLen, netList) {
        let xLen = XLen;
        let yLen = YLen;

        this.netList = netList;
        this.boardArray = new Array(xLen);            //Create an array to act as our board

        for (var i = 0; i < this.boardArray.length; i++) {
            this.boardArray[i] = new Array(yLen);
        }
    }
}

class NetRouter {
    constructor (board) {
        /*This constructor needs to not over write and of the stuff already on the baord array*/ 
        var b = board; 

        let highDistCords, lowDistCords = [];

        var maxDist = XLen * YLen; 

        for (var i = 0; i < b.boardArray.length; i++) {
            for (var j = 0; j < b.boardArray[i].length; j++) {
                b.boardArray[i][j] = maxDist;
            }
        }
    }


}


class BoardRouter extends NetRouter {  //Subclass the board class

    constructor (board) {
        super(board);
    }

}

let ANet = new net(1,1,3,3);
let ANetList = [ANet];

let r = new router(10,10,ANetList);

console.log(r.pcb);