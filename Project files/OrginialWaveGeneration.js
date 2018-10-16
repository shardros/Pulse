function validToAdd(x,y,value) {
    console.log('valid to add caled x: ', x, ' y: ', y, ' with value of ', value);
    if (x >= 0 && y >= 0 && x <= 5-1 && y <= 5-1) {
        console.log(board);
        if (board[x][y]==8) {
            console.log('Returning X for cords x: ', x, ' y: ', y, ' with value of ', value);
            return 'X'
        } else if (value < board[x][y]) {
            board[x][y] = value;
            toBeCheckedCords.push({xcord:x, ycord:y}); 
        }
    }
}



var xlen = 5;
var ylen = 5;
var board = new Array(xlen);

for (var i = 0; i < board.length; i++) {
    board[i] = new Array(ylen);
    for (var j = 0; j < board[i].length; j++) {
        board[i][j] = 9;
    }
}

board[1][1] = 0;
board[3][3] = 8

console.log(board);

checkedCords = [];
checkedCords.push({xcord: 1, ycord: 1});
toBeCheckedCords = [];
found = false;


while (!found) {
    console.log('In while not found');
    for (var i = 0; i < checkedCords.length; i++) {
        console.log(checkedCords[i]);
        startx = checkedCords[i].xcord;
        starty = checkedCords[i].ycord;
        console.log('Checking x: ', startx, ', y: ', starty);
        if (
            validToAdd(startx + 1, starty, board[startx][starty] + 1) == 'X' ||
            validToAdd(startx, starty + 1, board[startx][starty] + 1) == 'X' ||
            validToAdd(startx - 1, starty, board[startx][starty] + 1) == 'X' ||
            validToAdd(startx, starty - 1, board[startx][starty] + 1) == 'X'  
        ) {
            console.log('WE GOT THERE!!!!');
            found = true;
            break;
        }
    }
    console.log('To be checked cords ', toBeCheckedCords);
    if (toBeCheckedCords.length == 0) {
        found = true;
        console.log('NO SOLUTION FOUND')
    }
    checkedCords = toBeCheckedCords;
    toBeCheckedCords = [];
}