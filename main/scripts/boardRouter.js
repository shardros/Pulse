const nr = require('./netRouter');
const b = require('./board');

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

/**
 * Floods all of the cells possible from a cell
 * This could have been made recursively in theory however
 * JS doesn't support tail optimaisation and so it would have caused
 * StackOver Flows left right and center
 * @param {Cell} Cell Where we start the flood from
 * @returns {<Cell>} Returns list of cells in the flood
 */
BoardRouter.prototype.flood = function(Cell) {

    //Must check this as we use weather cell is defined in the while loop later
    //!EXAMPLE OF ERROR HANDELING
    if (typeof(Cell) == undefined) {
        throw Error ("Flood method passed undefined cell");
    } 
    
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

    const hurestristicWeight = 1.5; //DO NOT TOUCH
    
    let tracks = new Array;

    //If i have to go through the list any ways then this is linner time and I could
    //Implement my own sorting algorithium
    this.netList.sort((cellA, cellB) =>
        cellA.manhattanLength() - cellB.manhattanLength()
    );



    try {
        this.netList.forEach((net, i) => {
            net.routingErrors = 0;
            net.id = i;
            this.board.markNeighboursAsUnrouteable(net.startCell,true,net.id,1,)
            this.board.markNeighboursAsUnrouteable(net.endCell,true,net.id,1)
        });
   
    } catch (err) {
        if (err.name == "TypeError") {
            //The user selected a node on the edge of the board
            errors.push('Not all nets on the board');
        } else {
            //This *should* never happen but if it does we want to know what happened
            throw err;
        }
    } 

    let toRoute = this.netList.slice();

    //for (let c = 0; c < 3; c++) {
    while (toRoute.length > 0) {
        try {
            currentNet = toRoute.shift();
            console.log(currentNet.id);
            let myNetRouter = new NetRouter(this.board, 
                                            currentNet,
                                            hurestristicWeight,
                                            currentNet.id);
            let trace = myNetRouter.route();
            tracks.push(trace);

        } catch (err) {

            currentNet.routingErrors++;

            if (currentNet.routingErrors < errorThreshold) {
                
                let getNetIDsToClear = function(net) {
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
                
                console.log(err.message);

                //Make the net that just failed the first net to try again
                let toReRoute = [currentNet];

                //Converts the net ID's to actual net objects
                let netIDsToClear = getNetIDsToClear(currentNet);
                
                let netsToClear = netIDsToClear.map((ID) => {
                    return this.netList[ID];
                }, this)

                netIDsToClear.map((ID) => {
                    this.netList.splice(ID,1);
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

                toRoute.unshift(...toReRoute);
            }  else {
                errors.push("max routing tries exceeded")
            }
        }
    }
 
    return {
        tracks: tracks,
        errors: errors
    };
}


module.exports = {BoardRouter};