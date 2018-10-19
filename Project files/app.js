/*
H   H EEEEE L     L      OOO       W   W  OOO  RRRR  L     DDDD  !!
H   H E     L     L     O   O      W W W O   O R   R L     D   D !! 
HHHHH EEEEE L     L     O   O      W W W O   O RRRR  L     D   D !! 
H   H E     L     L     O   O  ,,   W W  O   O R   R L     D   D    
H   H EEEEE LLLLL LLLLL  OOO  ,,    W W   OOO  R   R LLLLL DDDD  !!
*/

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
        let xLen = XLen;
        let yLen = YLen;

        this.netList = netList;
        this.boardArray = new Array(xLen);            //Create an array to act as our board

        for (var i = 0; i < this.boardArray.length; i++) {
            this.boardArray[i] = new Array(yLen);
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
        this.b = board; //******NOTE TO SELF****** Should this be a private property, yes if you can make it do that. using var gives it scope to the constructor
                       //Using this is dirty.

        var maxDist = this.b.XLen * this.b.YLen; 
        //This is the worst possible and longest route that we could take on the board so set the default values of everything to that

        for (var i = 0; i < this.b.boardArray.length; i++) {
            for (var j = 0; j < this.b.boardArray[i].length; j++) {
                //****** NOTE TO SELF ******* This needs to be fixed to not overwrite any existing tracks
                this.b.boardArray[i][j] = maxDist;
            }
        }
    }


    routeNet (net) {
        /*
        ToDo:
            - There maybe ways to refactor this to use arrow functions
        */
       let highDistCords, lowDistCords = []

        lowDistCords.push({x1: net.x1, y1: net.y1});

  
        let validToAdd = function (x,y,value) {  //Declare a function with limited scope. I.E. local to the routeNet function 
            console.log(this);
            if (x >= 0 && y >= 0 && x <= this.b.XLen-1 && y <= this.b.YLen-1 && this.b.boardArray[x][y] != '#') { //Is the cordinate not on the board & and can we draw a wire here?
                if (this.b.boardArray[x][y]=='X') {            //Is it the end point that we are looking for?
                    return 'X'
                } else if (value < b[x][y]) {
                // Is there a quicker way to get to that x value
                    this.b.boardArray[x][y] = value;
                    highDistCords.push({xcord:x, ycord:y}); //Add it to the stack of high dist cords
                }
            }
            
        }
    

        let found = false;
        let neighbours = new Array(4);

        while (!found) {
            for (var i = 0; i < lowDistCords.length; i++) {
                //Go through all the low rank cords and check for a higher rank around them
                let x1 = lowDistCords[i].x1;
                let y1 = lowDistCords[i].y1;
                //Find the x and y of the currently selected low rank cord
        
                let NewValue = this.b.boardArray[x1][y1] + 1; 

                neighbours.push(validToAdd(x1 + 1, y1, NewValue));
                neighbours.push(validToAdd(x1, y1 + 1, NewValue));
                neighbours.push(validToAdd(x1 - 1, y1, NewValue));
                neighbours.push(validToAdd(x1, y1 - 1, NewValue));
                //checks cords above, bellow, left and right to see if we can lower their rank or if they are the finish
                if (neighbours.includes('X')) { 
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

let B = new Board(10,10,ANetList);

let BR = new BoardRouter(B);

BR.routeNet(ANet);