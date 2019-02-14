const nr = require('./netRouter');
const b = require('./board');

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
            net.id = i;
            this.board.markNeighboursAsUnrouteable(net.startCell,true,net.id,1,)
            this.board.markNeighboursAsUnrouteable(net.endCell,true,net.id,1)
        });
   
    } catch (err) {
        if (err.name == "TypeError") {
            //The user selected a node on the edge of the board.
        } else {
            //This *should* never happen but if it does we want to know what happened
            throw err;
        }
    } 

        for (var i = 0; i < this.netList.length; i++) {
            try {        

                //The default case where the route is possible
                this.netList[i].id = i; 
                let myNetRouter = new NetRouter(this.board, 
                                                this.netList[i],
                                                hurestristicWeight,
                                                this.netList[i].id);
                let trace = myNetRouter.route();
                tracks.push(trace);

            } catch (err) {
                try {
                    
                    console.log(err.message)

                    //The net route failed
                    //!Use of a set!
                    let netsToRipup = new Set;
                    start = this.netList[i].startCell;
                    end = this.netList[i].endCell;

                    bigX = Math.max(start.x, end.x);
                    smallX = Math.min(start.x, end.x);

                    bigY = Math.max(start.y, end.y);
                    smallY = Math.min(start.y, end.y);

                    
                    //There should only ever be one net belonging to a cell why does this support multiple?
                    for (let x = smallX; x < bigX; x++) {
                        let netIDs = this.board.getCell(x,start.y).controllingNet;
                        netIDs.forEach(controllingNet => netsToRipup.add(controllingNet.controllingNetID));                
                    }

                    for (let y = smallY; y < bigY; y++) {
                        let netIDs = this.board.getCell(y,end.x).controllingNet;
                        netIDs.forEach(controllingNet => netsToRipup.add(controllingNet.controllingNetID));                
                    }

                    //Remove the traces that are blocking our net from being routed
                    netsToRipup.forEach(netIndex => {
                        let currentTrace = this.netList[netIndex].trace;
                        currentTraceLength = currentTrace.length;
                        for(traceCellIndex = 0; traceCellIndex < currentTraceLength; traceCellIndex++) {
                            this.board.markNeighboursAsRouteable(currentTrace[traceCellIndex],
                                                                true,
                                                                netIndex,
                                                                1);
                            this.board.markCellAsUntracked(currentTrace[traceCellIndex]);
                            //currentTrace[traceCellIndex].tracked = false;
                        }
                    })

                
                    //Retry routing our route
                    let myNetRouter = new NetRouter(this.board, 
                                                    this.netList[i],
                                                    hurestristicWeight,
                                                    this.netList[i].id);
                    tracks.push(myNetRouter.route());

                    //Reroute the ones that weren't routed right the first time
                    netsToRipup.forEach(netIndex => {
                        let myNetRouter = new NetRouter(this.board, 
                            this.netList[netIndex],
                            hurestristicWeight,
                            this.netList[netIndex].id);
                        myNetRouter.reset(); //need to reset as have already made this route
                        tracks[netIndex] = [];//We know that the old trace is rubish so lets not use that
                        tracks[netIndex] =  myNetRouter.route();

                    })
                netsToRipup = new Set; //Reset the ripup nets for the next one

            } catch (err) {
                    errors.push("FAILED TO ROUTE TRACKS ROUTED. Board has errors");
                    //route impossibe
                    
                }
            }
        }

 
    return {
        tracks: tracks,
        errors: errors
    };
}


module.exports = {BoardRouter};