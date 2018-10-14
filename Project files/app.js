xDemension = 10
yDemension = 10

class PCB {
    constructor (x, y) {
        this.xlen = x;
        this.ylen = y;
        this.nets = [];
        var board = new Array(this.xlen);

        for (var i = 0; i < board.length; i++) {
            board[i] = new Array(this.ylen);
        }
    }


}

class Net {
    constructor (x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    route (pcb) {
                
    }
}

var pcb = new PCB(10,10);

pcb.nets[0] = new Net(1,1,9,9); 

console.log(pcb.nets);

