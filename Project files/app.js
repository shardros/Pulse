class Net {
    constructor (x1,y1,x2,y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

class Board {
    constructor(XLen, YLen, netList) {
        this.xLen = XLen;
        this.yLen = YLen;

        this.netList = netList;
        this.boardArray = new Array(xLen);            //Create an array to act as our board

        for (var i = 0; i < this.boardArray.length; i++) {
            this.boardArray[i] = new Array(this.yLen);
        }
    }
}

Object.defineProperty(Board, "prop", {    //NOTE TO FUTURE ME: Work out how to intergrate this into the class
    value: "test",
    writable: false
});

class NetRouter {
    constructor (board) {
        /*This constructor needs to not over write and of the stuff already on the baord array*/ 
        this.b = board; //******NOTE TO SELF****** Should this be a private property

        var maxDist = b.XLen * b.YLen; 
        //This is the worst possible and longest route that we could take on the board so set the default values of everything to that

        for (var i = 0; i < this.b.boardArray.length; i++) {
            for (var j = 0; j < this.b.boardArray[i].length; j++) {
                //****** NOTE TO SELF ******* This needs to be fixed to not overwrite any existing tracks
                this.b.boardArray[i][j] = maxDist;
            }
        }
    }


    routeNet (net) {
        let highDistCords, lowDistCords = []

        let validToAdd = function (x,y,value) {  //Declare a function with limited scope. I.E. local to the routeNet function 
            if (x >= 0 && y >= 0 && x <= xlen-1 && y <= ylen-1) { //Is the cordinate not on the board
                if (this.b.boardArray[x][y]=='X') {            //Is it the end point that we are looking for?
                    return 'X'
                } else if (value < this.board[x][y]) {
                // Is there a quicker way to get to that x value
                    this.board[x][y] = value;
                    highDistCords.push({xcord:x, ycord:y}); //Add it to the stack of high value numbers
                }
            }
            
        }
    

        let found = false;
        let neighbours = new Array(4);

        while (!found) {
            for (var i = 0; i < lowDistCords.length; i++) {
                //Go through all the low rank cords and check for a higher rank around them
                startx = lowDistCords[i].xcord;
                starty = lowDistCords[i].ycord;
                //Find the x and y of the currently selected low rank cord
        
                neighbours.push(validToAdd(startx + 1, starty, board[startx][starty] + 1));
                neighbours.push(validToAdd(startx, starty + 1, board[startx][starty] + 1));
                neighbours.push(validToAdd(startx - 1, starty, board[startx][starty] + 1));
                neighbours.push(validToAdd(startx, starty - 1, board[startx][starty] + 1));
                //checks cords above, bellow, left and right to see if we can lower their rank or if they are the finish
                if (neighbours.includes('X')) { 
                /*Note it is important that the function calls are not put in the if statement otherwise lazy evaluation
                 *May cause some errors */
                    found = true;
                    console.log('FOUND X');
                    break;
                }
            }
        
            if (highDistCords.length == 0) {
                found = true;
                console.log('ERROR: No Route found');
                //If we ever run out of high rank cords then there is no possible route
            }
        
            lowDistCords = highDistCords;   //Low becomes high before we loop again.
            highDistCords = [];
        }
        


    
    }
}


class BoardRouter extends NetRouter {  //Subclass the board class

    constructor (board) {
        super(board);
    }

}

let ANet = new Net(1,1,3,3);
let ANetList = [ANet];

let r = new NetRouter(10,10,ANetList);

console.log(r.pcb);