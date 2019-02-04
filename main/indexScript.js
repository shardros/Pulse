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
  
    buildDOM (elementID) {
      var cellPadder = document.createElement("div");
      cellPadder.className = "PointPadder";
      cellPadder.id = elementID + "Padding";
  
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
  
  //The names of the local varibles in this class are messy, this.grid describes the board etc.
  class Grid {
    /**
    @pram {Number} width the width cell units
    @pram {Number} width the height in cell units
    @pram {Number} cellSize the size in cell units
    */
    constructor (gridID, endPointContainerID, width, height, cellSize) {
      this.grid = document.getElementById(gridID);
      console.log(endPointContainerID)
      this.endPointContainer = document.getElementById(endPointContainerID);
      this.width = width;
      this.height = height;
      this.cellSize = cellSize;
      this.netList = [];    
    }
  
     makeDragable(cell) {
      var grid = this;
  
      var startx = cell.x * this.cellSize;
      var starty = cell.y * this.cellSize;
      var newXPos = 0, newYPos = 0,
        oldXPos = 0, oldYPos = 0;
      var elmnt = cell.el; //el is standard shorthand for element in web frameoworks
  
      document.getElementById(cell.elementID + "Padding").onmousedown = dragMouseDown;
      
      elmnt.style.top = (starty)
                      + this.grid.getBoundingClientRect().top
                      + "px";
      
      elmnt.style.left = (startx)
                      + this.grid.getBoundingClientRect().left
                      + "px";
  
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();   //Prevents the default method from running
  
        // get the mouse cursor position at startup:
        oldXPos = getRoundedMouseX(e);
        oldYPos = getRoundedMouseY(e);
  
        document.onmouseup = closeDragElement;  //Assign the on mouseup method to closeDragElement
  
        document.onmousemove = elementDrag;     //Assign the on mousemove elementDrag method to elementDrag
      }
  
      function elementDrag(e) {
        e = e || window.event; //Work out what this does
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
  
      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
  
        //update the cells position.
        cell.x = Math.ceil((elmnt.offsetLeft - grid.grid.getBoundingClientRect().left)/grid.cellSize  );
        cell.y = Math.ceil((elmnt.offsetTop - grid.grid.getBoundingClientRect().top)/grid.cellSize) ;
  
        grid.update();
      }
    }
  
    /**
     * Inalizes a net
     */
    createNet(startx,starty,endx,endy) {
      let start = new clientSideCell(startx, starty);
      let end = new clientSideCell(endx, endy);
  
      this.endPointContainer.appendChild(
        start.buildDOM("start" + this.netList.length));
      
      this.endPointContainer.appendChild(
      end.buildDOM("end" + this.netList.length));
  
      console.log(this.endPointContainer)
  
      this.makeDragable(start);
      this.makeDragable(end);
  
      let net = new clientSideNet(start,end,this.netList.length);
      
      this.netList.push(net);
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
      let resGrid = fetch('/route?cellSize=' + this.cellSize, {
      
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.netList)
      
      })
      
      //Await for the promise to be fullied when it is set the value of the dom to be that
      this.grid.innerHTML = await resGrid.then(response => response.text());
    }
  }
  
  
  //------------MAIN------------
  
  const cellSize = 10;
  const gridWidth = 100;
  const gridHeight = 100;
  const nodeContainerID = "node-container";
  const gridID = "board";
  
  var grid = new Grid(gridID,nodeContainerID,gridWidth,gridHeight,cellSize);
  
  grid.createNet(2,2,3,8)
  grid.createNet(8,8,10,10)
  
  grid.update();
  