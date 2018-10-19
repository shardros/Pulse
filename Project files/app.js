/*
H   H EEEEE L     L      OOO       W   W  OOO  RRRR  L     DDDD  !!
H   H E     L     L     O   O      W W W O   O R   R L     D   D !! 
HHHHH EEEEE L     L     O   O      W W W O   O RRRR  L     D   D !! 
H   H E     L     L     O   O  ,,   W W  O   O R   R L     D   D    
H   H EEEEE LLLLL LLLLL  OOO  ,,    W W   OOO  R   R LLLLL DDDD  !!

Comment for vs code preview pane
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
        this.XLen = XLen;
        this.YLen = YLen;

        this.netList = netList;
        this.boardArray = new Array(this.XLen);            //Create an array to act as our board

        for (var i = 0; i < this.boardArray.length; i++) {
            this.boardArray[i] = new Array(this.YLen);
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

       var b = this.b; // required to allow local function for acess the object property.
       // this is supper dirty and I hate it.

        let highDistCords = [], lowDistCords = [];

        lowDistCords.push({x: net.x1, y: net.y1});

        b.boardArray[net.x1][net.y1] = 0;
        b.boardArray[net.x2][net.y2] = 'X';
        
        let validToAdd = function (x,y,value) {  //Declare a function with limited scope. I.E. local to the routeNet function 
            if (x >= 0 && y >= 0 && x <= b.XLen-1 && y <= b.YLen-1 && b.boardArray[x][y] != '#') { //Is the cordinate not on the board & and can we draw a wire here?
                if (b.boardArray[x][y]=='X') {            //Is it the end point that we are looking for?
                    return 'X'
                } else if (value < b.boardArray[x][y]) {
                // Is there a quicker way to get to that x value
                    b.boardArray[x][y] = value;
                    highDistCords.push({x:x, y:y}); //Add it to the stack of high dist cords
                }
            }
            
        }
        

        let found = false;
        let neighbours = new Array(4);

        while (!found) {
            for (var i = 0; i < lowDistCords.length; i++) {
                //Go through all the low rank cords and check for a higher rank around them
                let x = lowDistCords[i].x;
                let y = lowDistCords[i].y;
                //Find the x and y of the currently selected low rank cord
        
                let NewValue = this.b.boardArray[x][y] + 1; 

                neighbours.push(validToAdd(x + 1, y, NewValue));
                neighbours.push(validToAdd(x, y + 1, NewValue));
                neighbours.push(validToAdd(x - 1, y, NewValue));
                neighbours.push(validToAdd(x, y - 1, NewValue));

                this.b = b; //Need to update the local b varible with the new content that was updated by the function. 
                            //Maybe update the varible at the end of the function that way we don't have this whole mess constantly.

                //checks cords above, bellow, left and right to see if we can lower their rank or if they are the finish
                if (neighbours.includes('X')) { 
                    found = true;
                    break;
                }
            }
            
            if (highDistCords.length == 0) {
                found = true;
                console.log('ERROR: No Route found');
                //If we ever run out of high rank cords then there is no possible route
            }
        
            lowDistCords = highDistCords;   //Low becomes high before we loop again.
            highDistCords = [];             //Clear the high
        }

        function minIndex(array) {
            //Find the fist non # number in the array
            for (var i = 0; i <= 3; i++) {
                if (array[i] != '#' && typeof array[i] !== 'undefined') {
                    var min = array[i];
                    var index = i;
                    break;
                }
            }
            
            //Find the lowest index

            for (var i = 0; i < array.length; i++) {
                if (array[i] != '#' && min > array[i]) {
                    index = i;
                }
            }
            return (index);
        }

        function showPath(x,y) {
            
            if (b.boardArray[x][y] == 0) {
                b.boardArray[x][y] = '#';
                console.log('ROUTE COMPLETED');
                
            } else {
                b.boardArray[x][y] = '#';
              
                let neighbours = []               //Declare a varible with limited scope
                neighbours.push(b.boardArray[x + 1][y]);
                neighbours.push(b.boardArray[x][y + 1])
                neighbours.push(b.boardArray[x - 1][y]);
                neighbours.push(b.boardArray[x][y - 1]);

                var smallestIndex = minIndex(neighbours);

                if (smallestIndex == 0) {showPath(x + 1, y); } else
                if (smallestIndex == 1) {showPath(x, y + 1); } else
                if (smallestIndex == 2) {showPath(x - 1, y); } else
                if (smallestIndex == 3) {showPath(x, y - 1); };
            }
        }

        showPath(net.x2, net.y2);

        //Clear the board
        for (var x in b.boardArray) {
            for (var y in b.boardArray) {
                if (b.boardArray[x][y] != '#') {
                    b.boardArray[x][y] = ' ';
                }
            }
        }

        console.log(b.boardArray)

    
    }
}


class BoardRouter extends NetRouter {  //Subclass the board class

    constructor (board) {
        super(board);
    }

}

let ANet = new Net(1,1,7,9);
let ANetList = [ANet];

let B = new Board(10,10,ANetList);

let BR = new BoardRouter(B);

BR.routeNet(ANet);