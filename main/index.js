const http = require('http');
const fs = require('fs');
const url = require('url');

const nr = require('./scripts/netRouter');
const br = require('./scripts/boardRouter')
const b = require('./scripts/board');
const svg = require('./scripts/svg'); 
const colour = require('./scripts/colour');

const port = 8080;
const debug = false;

const fileTypes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/javascript'
};

/**
 * Converts a JSON netlist into an SVG represenation of the routed board.
 * @param {JSON} JSONData 
 */
var routeJSON = function(JSONData, cellSize) {

    let JSONnetList = JSON.parse(JSONData);
    
    console.log(JSONnetList);

    const trackWidth = cellSize;
    const boardWidth = 190;
    const boardHeight = 90;
    const numberOfLayers = 1;

    /**If all goes to plan then this should be an array but we don't know
     * Maybe someone evil is using the API
     */
    try {

        var netList = []
        let length = JSONnetList.length;

        for (i = 0; i < length; i++) {
            let start = new b.Cell( JSONnetList[i].start.x,
                                    JSONnetList[i].start.y);
            
            let end = new b.Cell(   JSONnetList[i].end.x,
                                    JSONnetList[i].end.y);

            netList.push(new b.Net(start, end));
        }

    } catch (err) {
        throw err
    }

    board = new b.Board(boardWidth,boardHeight);

    BR = new br.BoardRouter(board, netList);

    let topLeft = new b.Cell(0,0);
    let bottomRight = new b.Cell(boardWidth-1,boardHeight-1);

    BR.createKeepOut(topLeft,bottomRight);

    let tracks = BR.route();

    var SvgMaker = new svg.Maker; 

    //Shows the area on the board which have been marked as not routeable
    for (var x = 0; x < board.width; x++) {
        for (var y = 0; y < board.height; y++) {
            if (!board.getCell(x,y).routeable) {
                let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
                Rect.fillColour = new colour.Colour(0,255,255);
                SvgMaker.addElement(Rect); 
            }
        }
    }

    //!For debug
    if (debug) {
        //Shows the area on the board marked as checked
        for (var x = 0; x < board.width; x++) {
            for (var y = 0; y < board.height; y++) {
                if (board.getCell(x,y).checked) {
                    let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
                    Rect.fillColour = new Colour.colour(44, 127, 25);
                    SvgMaker.addElement(Rect); 
                }
            }
        }

        console.log('Built non routeable sections');
    }

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

    return SvgMaker.getImage();
    
}

/**
 * ===========SERVER===========
 */



/**
 * This serves all the files in the directories located beneath the server, not great for security but I don't care so
 * on that front we are all good :-)
 * @type {module:http.Server}
 */
let server = http.createServer(function (req, res) {

    var parsedURL = url.parse(req.url, true);
    console.log('Requested: ', parsedURL.pathname);

    //Alows assignment specific urls to files. 
    switch (parsedURL.pathname) {
        case '/':
            
            fs.readFile('./index.html', function read(err, indexFile) {
                if (err) throw err;
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(indexFile);
                res.end();
            });

            break;

        case '/route':
            console.log('Route API called with parameters: ', parsedURL.query);
            console.log('Getting body contents');

            let requestBody = new String;
            req.on('data', chunk => {
                requestBody += chunk.toString(); // convert Buffer to string
            });
            
            req.on('end', () => {
                //The request has ended lets give them their new route

                let svgRes = routeJSON(requestBody, parsedURL.query.cellSize);

                res.end(svgRes);
            });


            break;
        default:
            fs.readFile('./' + req.url, function(err, data) {
                if (err) {
                    console.log ('file not found: ' + req.url);
                    res.writeHead(404, "Not Found");
                    res.write('THERE WAS A 404')
                    res.end();
                } else { //There was no error

                    /**
                     * We now need to automatically seve the file however
                     * we don't know what mimetype (e.g. is it a text/html)
                     * this gets the file extentsion and assumes that is the
                     * value of the sign we want. We can do this by finding the 
                     * last dot in the file name, then looking that extention
                     * up in a dictionary.
                     */ 
                    let dotPosFromEnd = req.url.lastIndexOf('.');
                    let mimetype = 'text/plain';
                    
                    if (!(dotPosFromEnd == -1)) {
                        //Perform a look up for the text using the suffix in a dictionary
                        mimetype = fileTypes[req.url.substr(dotPosFromEnd)];
                    }   

                    res.setHeader('Content-type' , mimetype);
                    res.end(data);
                }
            });
    }
}).listen(port);

console.log('Sever listening on port ', port);
