var nr = require('./netrouter');
var br = require('./boardRouter')
var b = require('./board');
var svg = require('./svg'); 
var http = require('http');

board = new b.Board(10,10);

start = new b.Cell(2,2);
end = new b.Cell(7,5    );

net = new b.Net(start, end);

netList = [net]

BR = new br.BoardRouter(board, netList);

let tracks = BR.route();

var SvgMaker = new svg.Maker; 
//Note to future me work out why this needs to be implemented like this.

for (var track = 0; track < tracks.length; track++) {
    for (var cell = 0; cell < tracks[track].length; cell++) {
        let x = tracks[track][cell].x;
        let y = tracks[track][cell].y;

        let Rect = new svg.Rectangle(x*1,y*1,1,1);
        SvgMaker.addElement(Rect);
    }
}

http.createServer(function (req, res) {
    console.log('responding to a call');

    res.write('<html><body>');

    let DOM = SvgMaker.getImage();
    res.write(DOM);
    
    res.write('</body></html>');
    
    res.end();
    console.log('page loaded')
    
}).listen(8080);


console.log('server listening on port 8080')