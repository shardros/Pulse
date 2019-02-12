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
    }

    makeInteractable(cell, deleteCallBack) {
        var board = this;
        var startx = cell.x * this.cellSize;
        console.log({startx})
        var starty = cell.y * this.cellSize;
        var newXPos = 0;
        var newYPos = 0;
        var oldXPos = 0;
        var oldYPos = 0;
        var elmnt = cell.el; //!IS THIS LINE USED? el is standard shorthand for element in web frameoworks
        var mouseDownPos = {
            x: startx,
            y: starty
        } 


        //Overide default method
        document.getElementById(cell.elementID + "Padding").onmousedown = dragMouseDown;
        
        //Offset by the correct amount given css board layout
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
            
            mouseDownPos.x = elmnt.offsetLeft;
            mouseDownPos.y = elmnt.offsetTop;

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

            //Test weather the cell is touching any other cells, if so this could cause a problem
            let isCellInvalid = (element) => {
                return (element.start.x == newCellX
                || element.end.x == newCellX)
                && (element.start.y == newCellY
                || element.end.y == newCellY);
            }; 

            if ((board.netList.some(isCellInvalid))
                || (board.floodList.some(isCellInvalid))
                || (board.keepoutList.some(isCellInvalid))) 
            {
                alert('Can not place cell on cell!');

                elmnt.style.top = (mouseDownPos.y) + "px";
                elmnt.style.left = (mouseDownPos.x) + "px";
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
        let startID = "start" + this.netList.length;
        let endID = "end" + this.netList.length;

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
            var index = floodList.indexOf(cell);
            if (index > -1) {
                floodList.splice(index, 1);
            }
        }
    }

    createKeepout(startx, starty, endx, endy) {
        let start = new clientSideCell(startx, starty);
        let end = new clientSideCell(endx, endy);

        this.keepoutContainer.appendChild(
            start.buildDOM("keepoutStart" + this.keepoutList.length,"keepout")
        );
        
        this.keepoutContainer.appendChild(
            end.buildDOM("keepoutEnd" + this.keepoutList.length,"keepout")
        );

        this.makeInteractable(start,deleteCallBack);
        this.makeInteractable(end,deleteCallBack);

        let keepout = new clientsideKeepout(start,end,this.keepoutList.length);
        
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
        let bodyContent = {
            netList: this.netList,
            floodList: this.floodList,
            keepoutList: this.keepoutList
        }
        
        let resGrid = fetch('/route?cellSize=' + this.cellSize, {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyContent)
        
        })
        
        //Await for the promise to be fullied when it is set the value of the dom to be that
        this.grid.innerHTML = await resGrid.then(response => response.text());
    }
}

function addNetButtonListener() {
    grid.createNet(2,2,4,4)
    grid.update();
}

function addFloodButtonListener() {
    grid.createFlood(5,5);
    grid.update();
}

function addKeepoutButtonListener() {
    grid.createKeepout(15,15,20,20);
    grid.update();
}

//------------MAIN------------

const cellSize = 10;
const gridWidth = 100;
const gridHeight = 100;
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

grid.createNet(2,2,3,8)
grid.createNet(8,8,10,10)

grid.update();
