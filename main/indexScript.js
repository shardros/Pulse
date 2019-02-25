//Define some functions for use just here 
//Does cellsize work up here?
function getRoundedMouseX (event, roundToNearest = cellSize) {
    return Math.ceil(event.clientX / roundToNearest) * roundToNearest;
}

function getRoundedMouseY (event, roundToNearest = cellSize) {
    return Math.ceil(event.clientY / roundToNearest) * roundToNearest;
}

//Make this just a data strucuture
class clientSideCell {
    constructor(x,y){
        //Initalize parameters
        this.x = x;
        this.y = y; 
    }

    buildDOM (elementID, ...classes) {
        var cellPadder = document.createElement("div");
        cellPadder.className = "PointPadder";
        cellPadder.id = elementID + "Padding";

        classes.forEach(DOMclass => {
            cellPadder.classList.add(DOMclass);
        });

        var cell = document.createElement("div");
        cell.className = "Point";
        cell.id = elementID;

        cell.appendChild(cellPadder);
        
        this.el = cell;
        this.elementID = elementID;

        return cell;
    }
}

//Make this just a data strucuture
class clientSideNet {
    constructor(start, end, id) {
        this.start = start;
        this.end = end;
        this.id = id;
    }
}

//Maybe make an abstract class for these two
class clientsideKeepout {
    constructor(start, end, id) {
        this.start = start;
        this.end = end;
    }
}
  
  //The names of the local varibles in this class are messy, this.grid describes the board etc.
class Grid {
    /**
    @pram {Number} width the width cell units
    @pram {Number} width the height in cell units
    @pram {Number} cellSize the size in cell units
    */
    constructor (gridID, endPointContainerID, floodContainerID ,keepoutContainerID, width, height, cellSize) {
        this.grid = document.getElementById(gridID);
        this.endPointContainer = document.getElementById(endPointContainerID);
        this.floodContainer = document.getElementById(floodContainerID);
        this.keepoutContainer = document.getElementById(keepoutContainerID);
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.netList = [];    
        this.floodList = [];
        this.keepoutList = [];
        this.cellCounter = 0;
        this.svg = null;
    }

    makeInteractable(cell, deleteCallBack) {
        var board = this;
        var startx = cell.x * this.cellSize;
        var starty = cell.y * this.cellSize;
        var newXPos = 0;
        var newYPos = 0;
        var oldXPos = 0;
        var oldYPos = 0;
        var elmnt = cell.el; //el is standard shorthand for element in web frameoworks
        var mouseDownPos = {
            cellx: cell.x,
            celly: cell.y,
            mousex: startx,
            mousey: starty
        } 


        //Overide default method
        document.getElementById(cell.elementID + "Padding").onmousedown = dragMouseDown ;
        
        //Offset by the correct amount given css grid layout
        elmnt.style.top = (starty)  
                        + board.grid.getBoundingClientRect().top
                        + "px";
        
        elmnt.style.left = (startx)
                        + board.grid.getBoundingClientRect().left
                        + "px";
                        
        function dragMouseDown(e) {
            e.preventDefault();   //Prevents the default method from running

            
            // get the mouse cursor position at startup:
            oldXPos = getRoundedMouseX(e);
            oldYPos = getRoundedMouseY(e);
            
            mouseDownPos.mousex = elmnt.offsetLeft;
            mouseDownPos.mousey = elmnt.offsetTop;
            mouseDownPos.cellx = cell.x;
            mouseDownPos.celly = cell.y;

            /**
             * If the control key is down then the user wants to delete this item
             */ 
            if (e.ctrlKey) {
                deleteCallBack()
                board.update();
            } else {
                document.onmouseup = stopDragging;  //Override the onmouseupmethod
                document.onmousemove = elementDrag;     //Assign the on mousemove elementDrag method to elementDrag
            }
        } 

        function elementDrag(e) {
            e.preventDefault();
            
            // calculate the new cursor position:
            newXPos = oldXPos - getRoundedMouseX(e);
            newYPos = oldYPos - getRoundedMouseY(e);
            
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - newYPos) + "px";
            elmnt.style.left = (elmnt.offsetLeft - newXPos) + "px";
            
            //Update the old positions
            oldXPos = getRoundedMouseX(e);
            oldYPos = getRoundedMouseY(e);
        }
        

        function stopDragging() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;

            //find new the cells position in grid terms.
            let newCellX = Math.ceil((elmnt.offsetLeft - board.grid.getBoundingClientRect().left)/board.cellSize);
            let newCellY = Math.ceil((elmnt.offsetTop - board.grid.getBoundingClientRect().top)/board.cellSize);

            /**Test if the new position for the cell is where any other cells are, or
             * if it is adjacent to any other cells
             * !NB will not work with floods as they would be element.x 
             */
            let isCellInvalid = (cell) => {
                //Check weather it was the orginal cell
                if ((mouseDownPos.celly) != cell.y || (mouseDownPos.cellx) != cell.x) {
                    for (let x = - 1; x <= 1; x++) {
                        for (let y = - 1; y <= 1; y++) {
                            if ((cell.x - x == newCellX
                                && cell.y - y == newCellY)
                                || (cell.x - x == newCellX
                                && cell.y - y == newCellY))
                            {
                                return true
                            }
                
                        }
                    }
                }
                return false 
            }; 

            if (
                (board.netList.some(net => {
                    return isCellInvalid(net.start)
                    || isCellInvalid(net.end)
                } ))

                || (board.floodList.some(isCellInvalid))

                || (board.keepoutList.forEach(keepout => {
                    return isCellInvalid(keepout.start) 
                    || isCellInvalid(keepout.end)
                } ))
            
            ){
                //!This interaction with the user possibly shouldn't be in this function
                document.getElementById('warning').innerHTML = "Nodes too close!";
                setTimeout(() => document.getElementById('warning').innerHTML = "", 2500);

                elmnt.style.top = (mouseDownPos.mousey) + "px";
                elmnt.style.left = (mouseDownPos.mousex) + "px";
            } else {
                cell.x = newCellX;
                cell.y = newCellY;
            }

            board.update();
        }
    }

    /**
     * Inalizes a net
     */
    createNet(startx,starty,endx,endy) {
        let start = new clientSideCell(startx, starty);
        let end = new clientSideCell(endx, endy);
        let startID = "start" + this.cellCounter;
        let endID = "end" + this.cellCounter;
        this.cellCounter++;

        this.endPointContainer.appendChild(
            start.buildDOM(startID)
        );
        
        this.endPointContainer.appendChild(
            end.buildDOM(endID)
        );

        let net = new clientSideNet(start,end);
        
        this.makeInteractable(start,deleteCallBack);
        this.makeInteractable(end,deleteCallBack);

        let netList = this.netList
        netList.push(net);

        function deleteCallBack() {
            start.el.remove(); //Remove the Dom
            end.el.remove();
            var index = netList.indexOf(net);
            if (index > -1) {
                netList.splice(index, 1);
            }
        }
        

    }

    createFlood(x,y) {
        let cell = new clientSideCell(x,y);

        this.floodContainer.appendChild(
            cell.buildDOM("flood","flood")
        )

        this.makeInteractable(cell, deleteCallBack);

        this.floodList.push(cell);

        let floodList = this.floodList;

        function deleteCallBack() {
            cell.el.remove(); //Remove the Dom
            document.getElementById("addFlood").disabled = false;
            floodList.pop();
        }
    }

    createKeepout(startx, starty, endx, endy) {
        let start = new clientSideCell(startx, starty);
        let end = new clientSideCell(endx, endy);

        this.keepoutContainer.appendChild(
            start.buildDOM("keepoutStart" + this.cellCounter,"keepout")
        );
        
        this.keepoutContainer.appendChild(
            end.buildDOM("keepoutEnd" + this.cellCounter,"keepout")
        );

        let keepout = new clientsideKeepout(start,end,this.cellCounter);
        
        this.cellCounter++;
        
        this.makeInteractable(start,deleteCallBack);
        this.makeInteractable(end,deleteCallBack);
        
        this.keepoutList.push(keepout);

        let keepoutList = this.keepoutList;

        function deleteCallBack() {
            start.el.remove(); //Remove the Dom
            end.el.remove();
            var index = keepoutList.indexOf(keepout);
            if (index > -1) {
                keepoutList.splice(index, 1);
            }
        }
    }

    addNet(net) {
        this.netList.push(net)
        return this.netList.length - 1;
    }

    //This is quite hacky and not very OOP should fix at somepoint
    net(id, contents) {
        this.netList[id] = contents; 
    }

    async update() {
        //Fetch the SVG DOM from the server but store the value as a promise
        let requestContent = {
            netList: this.netList,
            floodList: this.floodList,
            keepoutList: this.keepoutList
        }
        
        let resGrid = fetch('/route?cellSize=' + this.cellSize, {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestContent)
        
        })
        
        //Await for the promise to be fullied when it is set the value of the dom to be that
        let response = await resGrid.then(response => response.text());
        response = JSON.parse(response)
        this.grid.innerHTML = response.board;
        this.svg = response.board;
        //!Example of reduce
        if (response.errors.length > 0) { 
            let errorHeader = "Warning: <br/>"
            let groupedErrors = errorHeader + response.errors.reduce((accumulator, current) => accumulator + "<br/>" + current);
            document.getElementById('errors').innerHTML = groupedErrors; 
        } else {
            document.getElementById('errors').innerHTML = "";
        }
    }
}

function addNetButtonListener() {
    grid.createNet(2,2,4,4)
    grid.update();
}

function addFloodButtonListener() {
    document.getElementById("addFlood").disabled = true;
    grid.createFlood(5,5);
    grid.update();
}

function addKeepoutButtonListener() {
    grid.createKeepout(15,15,20,20);
    grid.update();
}

function downloadButtonListener() {
    var a = window.document.createElement('a');
    console.log(grid.grid.innerHTML)
    a.href = window.URL.createObjectURL(new Blob([grid.grid.innerHTML], {type: 'text/svg'}));
    a.download = 'board.svg';

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
}
//------------MAIN------------

const cellSize = 10;
const gridWidth = 10;
const gridHeight = 10;
const nodeContainerID = "node-container";
const floodContainerID = "flood-container";
const keepoutContainerID = "keepout-container"

const gridID = "board";

var grid = new Grid(gridID,
                    nodeContainerID,
                    floodContainerID,
                    keepoutContainerID,
                    gridWidth,
                    gridHeight,
                    cellSize);

grid.createNet(2,2,3,3)

grid.update();