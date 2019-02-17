const http = require('http');
const fs = require('fs');
const url = require('url');

const br = require('./scripts/boardRouter')
const b = require('./scripts/board');
const svg = require('./scripts/svg'); 
const colour = require('./scripts/colour');

const port = 1337;
const debug = false;

const path = "."
const indexLocation = "/index.html"

//Make this come from client side
const boardWidth = 80;
const boardHeight = 80;

//!Use of a dictionary
const fileTypes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/javascript'
};

/**
 * Converts a JSON netlist into an SVG represenation of the routed board.
 * @param {JSON} JSONData
 * @param {Number} cellSize 
 */
var routeJSON = function(JSONData, cellSize) {

    let errors = []

    JSONnetList = JSONData.netList;
    JSONFloodList = JSONData.floodList;
    JSONKeepoutList = JSONData.keepoutList;

    const trackWidth = cellSize;

    /**This is where we take the JSON inputed into the system and turn it into objects
     * that we can manipulate
     * 
     * If all goes to plan then this should be an array but we don't know
     * Maybe someone evil is using the API
     */
    try {

        var netList = []
        let length = JSONnetList.length;

        /**Creates each of the net objects from the specification in the
         * recived JSON
         */ 
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

    //? Move this to clientside and to depend of the screen res&size
    
    //Create the boarder of the board
    let topLeft = new b.Cell(0,0);
    let bottomRight = new b.Cell(boardWidth-1,boardHeight-1);
    BR.createKeepOut(topLeft,bottomRight);

    //Create any user specified keepouts
    JSONKeepoutList.forEach( keepout => {
        let topLeft = new b.Cell(keepout.start.x,keepout.start.y);
        let bottomRight = new b.Cell(keepout.end.x,keepout.end.y);
    
        BR.createKeepOut(topLeft,bottomRight,"keepout",1);
    });

    //Find a route for all of the specified objects
    let route = BR.route();

    errors = route.errors;
    let tracks = route.tracks;

    //Apply the flood now we know where the nets are going.
    try {
        floodCell = JSONFloodList[0];
        BR.flood(board.getCell(floodCell.x,floodCell.y));
    } catch(err) {
        if (err.name == "TypeError") {
            //This is to be expected if we have nothing to route
        } else {
            throw err
        }
    }    

    return {
        DOM: BuildDOM(tracks, trackWidth),
        errors: errors
    };
    
}


var BuildDOM = function(tracks, trackWidth) {
    //We now need to actually build the output, using the SVGmaker class
    var SvgMaker = new svg.Maker; 

    //Shows the area on the board which have been marked as not routeable
    for (var x = 0; x < board.width; x++) {
        for (var y = 0; y < board.height; y++) {
            if (!board.getCell(x,y).routeable) {
                let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
                
                if (board.getCell(x,y).controllingNet.map((i) => {
                    return i.routingOverrideLevel;
                }).reduce((a,c) => {
                    return a + c;
                },0)) { 
                    Rect.fillColour = new colour.Colour(124,0,0);
                } else {
                    Rect.fillColour = new colour.Colour(0,124,174);
                }
                SvgMaker.addElement(Rect); 
            }
        }
    }

    /**If the flood list is empty then all of the tracked cells will be along the routes and so
     * we can speed up our generation times by only going along the nets.
     * 
     * Otherwise we need to scan the whole board
     */
    if (JSONFloodList.length > 0) {
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                if (board.getCell(x,y).tracked) {
                    let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
                    Rect.fillColour = new colour.Colour(0,0,124);
                    SvgMaker.addElement(Rect); 
                }
            }
        }    
    } else {
        //The default where we can effiecently draw along the tracks rather than scan the whole
        //Board
        for (var track = 0; track < tracks.length; track++) {
            for (var cell = 0; cell < tracks[track].length; cell++) {
                let x = tracks[track][cell].x;
                let y = tracks[track][cell].y;

                let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
                Rect.fillColour = new colour.Colour(0,0,124)
                SvgMaker.addElement(Rect);
            }
        }
    }

    return SvgMaker.getImage();
}

/**
 * ===========SERVER===========
 */


/**
 * This serves all the files to the client
 * @type {module:http.Server}
 */
let server = http.createServer(function (req, res) {

    var parsedURL = url.parse(req.url, true);

    //This switch allows assignment specific urls to files. 
    switch (parsedURL.pathname) {
        //The entry point
        case ('/'):
            
            fs.readFile(path + indexLocation, function read(err, indexFile) {
                if (err) throw err;
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(indexFile);
                res.end();
            });

            break;

        //This handels requests for a routed version of the board
        case ('/route'):

            //NetLists etc passed to the server inside the body of the request
            let requestBody = new String;
            req.on('data', chunk => {
                requestBody += chunk.toString(); 
            });

            req.on('end', () => {
                //The request has ended and so we have all of the data
                // lets give them their new route

                let route = routeJSON(JSON.parse(requestBody), parseInt(parsedURL.query.cellSize));
                let svg = route.DOM;
                let errors = route.errors;

                responseContent = JSON.stringify({
                    board: svg,
                    errors: errors
                })

                res.end(responseContent);
            });

            break;

        //If they are requesting styles or other scripts
        default:
            fs.readFile('./' + path + req.url, function(err, data) {
                if (err) {
                    res.writeHead(404, "Not Found");
                    res.write('THERE WAS A 404')
                    res.end();
                } else { //There was no error

                    /**
                     * We now need to automatically serve the file however
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
