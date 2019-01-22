var nr = require('./netrouter');
var br = require('./boardRouter')
var b = require('./board');
var svg = require('./svg'); 
var Colour = require('./colour');
var http = require('http');

console.log('Initalizing router');

//Set the constants for the routing
const trackWidth = 10;
const boardWidth = 190;
const boardHeight = 90;
const numberOfLayers = 1;

//Create all of the objects that represent the exact problem that we are truing to solve
board = new b.Board(boardWidth,boardHeight);

netList = []


let start = new b.Cell(50,4);
let end = new b.Cell(84,80);

netList.push(new b.Net(start, end));


start = new b.Cell(54,4);
end = new b.Cell(88,80);

netList.push(new b.Net(start, end));


start = new b.Cell(58,4);
end = new b.Cell(92,80);

netList.push(new b.Net(start, end));


start = new b.Cell(62,4);
end = new b.Cell(96,80);

netList.push(new b.Net(start, end));

start = new b.Cell(40,80);
end = new b.Cell(20,20);

netList.push(new b.Net(start, end));

start = new b.Cell(70,10);
end = new b.Cell(20,24);



netList.push(new b.Net(start, end));


BR = new br.BoardRouter(board, netList);

let topLeft = new b.Cell(0,0);
let bottomRight = new b.Cell(boardWidth-1,boardHeight-1);

BR.createKeepOut(topLeft,bottomRight);



console.log('Routing')
console.time('RoutingTime');

let tracks = BR.route();

console.timeEnd('RoutingTime')

console.log('Flooding');

let myCell = new b.Cell(2,2);

//tracks.push(BR.flood(myCell));

console.log('Begining draw');

var SvgMaker = new svg.Maker; 

//Shows the area on the board which have been marked as not routeable
for (var x = 0; x < board.width; x++) {
    for (var y = 0; y < board.height; y++) {
        //----> THIS SHOULDN'T BE A GLOBAL FIX IT <----
        if (!board.grid[y][x].routeable) {
            let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
            Rect.fillColour = new Colour.colour(0,255,255);
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
