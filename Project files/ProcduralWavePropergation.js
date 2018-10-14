var xlen = 10;                         //Define grid size
var ylen = 10;

var startCord = {x: 3, y: 2};          //Create cord-obj of where we are coming from and going to
var endCord = {x: 7, y: 9};

var highRankCords = [];                /*Init a stack of the highest rank cords that we will know about.
                                       / We haven't found any yet so this is empty*/

var lowRankCords = [];                     //Create a stack for the highest 
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

while (!found) {
    for (var i = 0; i < lowRankCords.length; i++) {
        //Go through all the low rank items and check for a higher rank around them
        startx = lowRankCords[i].xcord;
        starty = lowRankCords[i].ycord;
        if (
            validToAdd(startx + 1, starty, board[startx][starty] + 1) == 'X' ||
            validToAdd(startx, starty + 1, board[startx][starty] + 1) == 'X' ||
            validToAdd(startx - 1, starty, board[startx][starty] + 1) == 'X' ||
            validToAdd(startx, starty - 1, board[startx][starty] + 1) == 'X'  
        ) 
        //All one if statement, checks cords above, bellow, left and right to see if we can lower their rank or if they are the finish
        {
            found = true;
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

console.log(board); //Show the user the end result