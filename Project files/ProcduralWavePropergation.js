var xlen = 10;                         //Define grid size
var ylen = 10;

var startCord = {x: 3, y: 2};          //Create cord-obj of where we are coming from and going to
var endCord = {x: 7, y: 9};

var highRankCords = [];                /*Init a stack of the highest rank cords that we will know about.
                                       / We haven't found any yet so this is empty*/

var lowRankCords = [];                 //Create a stack for the highest 
lowRankCords.push({xcord: startCord.x, ycord: startCord.y});  
                                       /*Currently the only cord we know the rank of is the 0th one at the
                                        start so push that */ 

var board = new Array(xlen);           //Create an array to act as our board

for (var i = 0; i < board.length; i++) {
    /* INIT the array with the correct demensions and a large value in every square.
    This ensures that it is always bigger than the route back to the start and so 
    will never go back the wrong way */
    board[i] = new Array(ylen);
    for (var j = 0; j < board[i].length; j++) {
        board[i][j] = xlen*ylen;
    }
}

board[startCord.x][startCord.y] = 0;   //Start
board[endCord.x][endCord.y] = 'X';     //End x marks the spot

console.log(board); //Show the user what we are starting with

function validToAdd(x,y,value) {
/*
    Checks weather it is valid to add a distance to the start to this cord
    if it is then it adds it. If it sees the end it returns 'X'

    x: int
    y: int
    value: int
    returns: str
*/
    if (x >= 0 && y >= 0 && x <= xlen-1 && y <= ylen-1) {
    //Is the cordinate not on the board
        if (board[x][y]=='X') {
            return 'X'
        } else if (value < board[x][y]) {
        // Is there a quicker way to get to that x value
            board[x][y] = value;
            highRankCords.push({xcord:x, ycord:y}); //Add it to the stack of high value numbers
        }
    }
}

//-----------------------------MAIN PROGRAM-----------------------------

found = false;
let neighbours = [] //This should really be a local varible but it isn't in a function yet

while (!found) {
    for (var i = 0; i < lowRankCords.length; i++) {
        //Go through all the low rank cords and check for a higher rank around them
        startx = lowRankCords[i].xcord;
        starty = lowRankCords[i].ycord;
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

    if (highRankCords.length == 0) {
        found = true;
        console.log('ERROR: No Route found');
        //If we ever run out of high rank cords then there is no possible route
    }

    lowRankCords = highRankCords;   //Low becomes high before we loop again.
    highRankCords = [];
}

console.log(board); //Show the user the trace


//----------- RETRACE -----------

console.log('Starting Retrace...');

function minIndex(array) {
    //Find the fist non # number in the array
    for (var i = 0; i <= 3; i++) {
        if (array[i] != '#') {
            var min = array[i];
            break;
        }
    }
    
    //Find the lowest index
    var index = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] != '#' && min > array[i]) {
            index = i;
        }
    }
    return (index);
}

function showPath(x,y) {

    if (board[x][y] == 0) {
        board[x][y] = '#';
        console.log('ROUTE COMPLETED');
        
    } else {
        board[x][y] = '#';

        let neighbours = []               //Declare a varible with limited scope
        neighbours.push(board[x + 1][y]);
        neighbours.push(board[x][y + 1])
        neighbours.push(board[x - 1][y]);
        neighbours.push(board[x][y - 1]);

        var smallestIndex = minIndex(neighbours);

        if (smallestIndex == 0) {showPath(x + 1, y); } else
        if (smallestIndex == 1) {showPath(x, y + 1); } else
        if (smallestIndex == 2) {showPath(x - 1, y); } else
        if (smallestIndex == 3) {showPath(x, y - 1); };
    }
}

showPath(endCord.x, endCord.y);

console.log(board);