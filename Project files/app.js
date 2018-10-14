xDemension = 10
yDemension = 10

class Net {
    constructor (x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

class PCB {
     constructor (x, y) {
        var xlen = x;
        var ylen = y;
        this.nets = [];
        this.board = new Array(xlen);

        for (var i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(ylen);
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = x*y;
            }
        }
    }

    addNet (net) {
        nets.push(net);
        this.board[net.x1][net.y1] = 0;
        this.board[net.x2][net.y2] = 'X'; 
    }
}

class router {
    constructor (Pcb) {
        this.board = Pcb.board;
    }

    route () {
        
    }

    waveAround (cellx,celly) {
        distFromStart = 0;
        var distFromStart = this.board[cellx][celly] + 1;
        console.log('Called WaveAround: ', distFromStart);
        for (var x = cellx-1; x < cellx + 2; x++) {
            for (var y = celly-1; y < celly + 2; y++) {
                
                if ((x >= 0) && (y >= 0)) {
                    if (this.board[x][y] = 'X') {
                        console.log('We Got there guys!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                    }
                    if (this.board[x][y] > distFromStart) {

                        this.board[x][y] = distFromStart + 1;
                        console.log(this.board);
                    }     
                } 
            }        
        }   


    }
}

var pcb = new PCB(10,10);

pcb.nets[0] = new Net(1,1,9,9); 

console.log(pcb.nets);

router = new router(pcb);

router.waveAround(1,1);