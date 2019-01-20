var nr = require('./netrouter');
var br = require('./boardRouter')
var b = require('./board');
var svg = require('./svg'); 
var http = require('http');

console.log('Initalizing router');

//Set the constants for the routing
const trackWidth = 10;
const boardWidth = 100;
const boardHeight = 100;
const numberOfLayers = 1;

//Create all of the objects that represent the exact problem that we are truing to solve
board = new b.Board(boardWidth,boardHeight);

let start1 = new b.Cell(70,10);
let end1 = new b.Cell(20,50);

net1 = new b.Net(start1, end1);

netList = [net1]

BR = new br.BoardRouter(board, netList);

console.log('Routing')

let tracks = BR.route();

console.log('Routed');
console.log('Begining draw');

var SvgMaker = new svg.Maker; 

//This is for debug, shows the area on the board which have been marked as not routeable
for (var x = 0; x < board.width; x++) {
    for (var y = 0; y < board.height; y++) {
        if (!board.grid[y][x].routeable) {
            let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
            Rect.fillColour = new svg.Colour(0,255,255);
            SvgMaker.addElement(Rect); 
        }
    }
}

console.log('Built non routeable sections');

//Note to future me work out why this needs to be implemented like this.
//Display the areas on the board which represent the tracks
for (var track = 0; track < tracks.length; track++) {
    for (var cell = 0; cell < tracks[track].length; cell++) {
        let x = tracks[track][cell].x;
        let y = tracks[track][cell].y;

        let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
        SvgMaker.addElement(Rect);
    }
}

console.log('Built routes');
console.log('Attempting to create a server');

//Create a server to send our SVG data over
http.createServer(function (req, res) {
    console.log('responding to a call');

    res.write('<html><body>');
    
    res.write('<h1>Edwins PCB Auto-router</h1>');

    let DOM = SvgMaker.getImage();
    res.write(DOM);
    
    res.write('</body></html>');
    
    res.end();
    console.log('page loaded')
    
}).listen(1337);

console.log('server listening on port 1337');
