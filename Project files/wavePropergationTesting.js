var xlen = 10;
var ylen = 10;
var board = new Array(xlen);

for (var i = 0; i < board.length; i++) {
    board[i] = new Array(ylen);
    for (var j = 0; j < board[i].length; j++) {
        board[i][j] = 999;
    }
}

board[1][1] = 0;
board[6][6] = 'X';

console.log(board);

function wave(startx, starty) {
    //Number the surrounding 8 cells
    for (var x = startx - 1; (x < startx + 2) && (x >= 0) && (x <= 9); x++) {
        for (var y = starty - 1; (y < starty + 2) && (y >= 0) && (y <= 9); y++) {
            if ((board[x][y] != 'X') && (board[x][y] > board[startx][starty])) {
                board[x][y] = board[startx][starty] + 1
            }
        } 
    }
    //Recursively call the propergation
    for (var x = startx - 1; (x < startx + 2) && (x >= 0) && (x <= 9); x++) {
        for (var y = starty - 1; (y < starty + 2) && (y >= 0) && (y <= 9); y++) {
            if ((startx != x) && (starty != y)) {
                if (x == 6 && y == 6) {
                    console.log('We GOT THERE!!!!')
                    return;
                } else {
                    console.log(board);
                    console.log('');
                    wave(x,y);
                }
            }
        }
    }
} 

wave(1,1)

console.log(board);
