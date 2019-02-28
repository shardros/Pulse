const nr = require('./netRouter');
const b = require('./board');

const hurestristicWeight = 1.5;
const errorThreshold = 2;

/**
 * The class for routing a whole board
 * @param {Board} board
 * @param {Array<Board.Net>} netList 
 */
BoardRouter = function (board, netList) {
    this.board = board;
    this.netList = netList;
}

/**
 * Creates a non routeable box
 * @param {Cell} cell1 The cell which defines one coner 
 * @param {Cell} cell2 The cell which defines one coner
 * @param {Boolean} borderOnly Do we allow routing with in the area 
 */
BoardRouter.prototype.createKeepOut = function(cell1, cell2, borderOnly = true) {
    
    if (this.board.CordsOnBoard(cell1.x, cell1.y) 
    && this.board.CordsOnBoard(cell2.x, cell2.y)) {
        //find the smaller of the cords so that we can itterate using a for loop
        if (cell1.x > cell2.x) {
            var bigX = cell1.x;
            var smallX = cell2.x;
        } else {
            var bigX = cell2.x;
            var smallX = cell1.x;
        }
        
        if (cell1.y > cell2.y) {
            var bigY = cell1.y;
            var smallY = cell2.y;
        } else {
            var bigY = cell2.y;
            var smallY = cell1.y;
        }

        if (borderOnly) {
            //Mark the horizontal walls as unrouteable
            for (let x = smallX + 1; x < bigX; x++) {
                this.board.markCordsAsUnrouteable(x,smallY)
                this.board.markCordsAsUnrouteable(x,bigY)
            }
            //Mark the verticle walls as unrouteable
            for (let y = smallY; y < bigY + 1; y++) {
                this.board.markCordsAsUnrouteable(smallX,y)
                this.board.markCordsAsUnrouteable(bigX,y)
            }
        } else {
            //Mark the whole areas as unrouteable
            for (let x = smallX; x < bigX; x++) {
                for (let y = smallY; y < bigY; y++) {
                    this.board.markCordsAsUnrouteable(x,y);    
                }
            }
        }
    }
}

/**
 * Floods all of the cells possible from a cell
 * This could have been made recursively in theory however
 * JS doesn't support tail optimaisation and so it would have caused
 * StackOver Flows left right and center.
 * @param {Cell} Cell Where we start the flood from
 * @returns {<Cell>} Returns list of cells in the flood
 */
BoardRouter.prototype.flood = function(Cell) {

    
    //Must check this as we use weather cell is defined in the while loop later
    //!EXAMPLE OF ERROR HANDELING
    if (typeof(Cell) == undefined) {
        throw Error ("Flood method passed undefined cell");
    } 
    
    this.board.markNeighboursAsRouteable(Cell, "Flood", 1)
    
    unchecked = [];
    flood = [];
    current = Cell;
    
    //Check if we can still pop items from the stack
    while (current) {
        if (current.routeable) {
            //Gets the routeable neighbours and pushes them to the unchecked list

            this.board.getValidNeighbours(current).forEach(cell => {
                unchecked.push(cell)
            });
            
            current.routeable = false;
            current.tracked = true;
            
            flood.push(current);   
        }

        current = unchecked.pop();
    }

    return flood;
}

/**
 * A function decide which order the nets are to be routed in
 */
BoardRouter.prototype.route = function() {
    let errors = [];
    
    let tracks = new Array;

    //If i have to go through the list any ways then this is linner time and I could
    //Implement my own sorting algorithium
    this.netList.sort((cellA, cellB) =>
        cellA.manhattanLength() - cellB.manhattanLength()
    );

    /**
     * PRE PROCESSING
     */
    
    try {

        this.netList = this.netList.filter((net) => {  
            if (!this.board.CordsOnBoard(net.start.x, net.start.y)
                || !this.board.CordsOnBoard(net.end.x, net.end.y)) {
                errors.push('Not all nets on the board');
                return false
            } else {
                return true
            }
        })
   
        this.netList.forEach((net, i) => {
            net.routingErrors = 0;
            net.id = i;
            this.board.markNeighboursAsUnrouteable(net.startCell,true,net.id,1,)
            this.board.markNeighboursAsUnrouteable(net.endCell,true,net.id,1)
        });
        
       
    } catch (err) {
        if (err.name == "TypeError") {
            //This is to be expected if there are no items on the board and we don't need to tell the user that          
        } else {
            //This *should* never happen but if it does we want to know what happened
            throw err;
        }
    } 

    //Clone the array
    //use of a queue
    let toRoute = this.netList.slice();

    while (toRoute.length > 0) {
        try {
            currentNet = toRoute.shift();
            let myNetRouter = new NetRouter(this.board, 
                currentNet,
                hurestristicWeight,
                currentNet.id);
                let trace = myNetRouter.route();
                tracks.push(trace);
                
            } catch (err) {
                
            currentNet.routingErrors++;

            //It is possible to build a set of nets that will cause tracks to be ripped up in a loop
            //This says just give up on a net after it has caused so many problems so we don't run forever
            if (currentNet.routingErrors < errorThreshold) {
                
                //Draws an L shape to find which nets that it should rip up
                let getNetIDsToClear = function(net) {
                    //Use of set
                    let netIDsToRipup = new Set;

                    start = net.startCell;
                    end = net.endCell;

                    bigX = Math.max(start.x, end.x);
                    smallX = Math.min(start.x, end.x);

                    bigY = Math.max(start.y, end.y);
                    smallY = Math.min(start.y, end.y);

                    for (let x = smallX; x < bigX; x++) {
                        let netIDs = this.board.getCell(x,start.y).controllingNet;
                        netIDs.forEach(controllingNet => netIDsToRipup.add(controllingNet.controllingNetID));                
                    }

                    for (let y = smallY; y < bigY; y++) {
                        let netIDs = this.board.getCell(y,end.x).controllingNet;
                        netIDs.forEach(controllingNet => netIDsToRipup.add(controllingNet.controllingNetID));                
                    }

                    //Convert the set to an array
                    netIDsToRipup = [...netIDsToRipup];

                    //remove the current net from the array
                    var index = netIDsToRipup.indexOf(net);
                    if (index > -1) {
                        netIDsToRipup.splice(index, 1);
                    }

                    return netIDsToRipup

                }
                

                //Make the net that just failed the first net to try again
                let toReRoute = [currentNet];

                //Use of alot of functional methods

                //Converts the net ID's to actual net objects and filter out the undefineds
                //caused when netList is empty
                let netIDsToClear = getNetIDsToClear(currentNet);
                
                let netsToClear = netIDsToClear.map((ID) => {
                    let net = this.netList.find((net) => {
                        let boolean = (net.id == ID)
                        return boolean
                    });
                    return net
                }, this).filter((element) => { element != undefined })

                netIDsToClear.forEach((ID) => {
                    this.netList.splice(
                        this.netList.findIndex((net) => { return net.id == ID })   
                    ,1);
                })
                
                //RipUp the nets
                netsToClear.forEach(net => { 
                    toReRoute.push(net)

                    var currentTrace = net.trace;
                    
                    //This could get slow with alot of nets
                    //Delete the trace from the trace array
                    tracks.splice(tracks.findIndex((value) => {return (currentTrace == value)}),1);

                    currentTraceLength = currentTrace.length;
                    for(traceCellIndex = 0; traceCellIndex < currentTraceLength; traceCellIndex++) {
                        
                        this.board.markNeighboursAsRouteable(currentTrace[traceCellIndex],
                                                            true,
                                                            net.id,
                                                            0);
                        //Remove the tracks from the board
                        this.board.markCellAsUntracked(currentTrace[traceCellIndex]);
                    }

                    net.trace = [];
                })

                //Prepend the nets that need to be ReRouted to the front of the array
                toRoute.unshift(...toReRoute);
            }  else {
                //Compile the error message for the user
                errors.push("Routing failed on: {start: (" + currentNet.startCell.x + ',' + currentNet.startCell.y +
                             '), end: ('+ currentNet.endCell.x + ',' + currentNet.endCell.y + ')}')
            }
        }
    }
 
    return {
        tracks: tracks,
        errors: errors
    };
}


module.exports = {BoardRouter};