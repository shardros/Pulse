const colour = require('./colour');

/**
 * An Abstract prototype for SVG shapes
 * @param {Number} x
 * @param {Number} y
 */
var svgShape = function(x, y, id, DOMClass) {
    //Make it so that the svgShape class is abstract
    if (new.target === svgShape) {
        throw new TypeError("Cannot construct Abstract instance of svgShape directly");
    }

    //Ensure that all subclasses implement the generateSVGString method
    if (this.generateSVGString === undefined) {
        throw new TypeError("Must override generateSVGString method of the abstract class svgShape");
    }   

    /**Ensure that all subclasses implement the getCordinatesOfBottomRight method
     * Used in working out weather to exand the size of the svgShape.
     */
    if (this.getCordinatesOfBottomRight === undefined) {
        throw new TypeError("Must override getCordinatesOfBottomRight method of the abstract class svgShape");
    }

    this.xPos = x;
    this.yPos = y;

    this.id = id;
    this.DOMClass = DOMClass

    this.nameOf = "svgShape";
    
}

//Sub-class svgShape
class Rectangle extends svgShape {

    /**
     * A class for storing svg rectangles
     * @param {Number} xPos The x position of the top left coner
     * @param {Number} yPos The y position of the top left coner
     * @param {Number} xLen The length of the shape in the x direction
     * @param {Number} yLen The length of the shape in the y direction
     * @param {String} id   The id of the rectangle. 
     */
    constructor (xPos = 0, yPos = 0, xLen = 10, yLen = 10, id, DOMClass="Rect") {
        super(xPos, yPos, id, DOMClass);
        this.xLen = xLen;
        this.yLen = yLen;
        this.fillColour = new colour.Colour(255,0,0);
        this.borderColour = new colour.Colour(255,255,255);
        this.borderWidth = 5;    
    }
}

/**
 * Takes all of the parameters of this SVG shape and returns a valid DOM
 * @returns {String} returns valid svg DOM
 */
Rectangle.prototype.generateSVGString = function() {
    return  '<rect id="#' + this.id +
            '" class="' + this.DOMClass +
            '" x=' + this.xPos +
            ' y=' + this.yPos +
            ' width=' + this.xLen +
            ' height=' + this.yLen +
            ' style="fill:' + this.fillColour.toHexString() + 
            ';, stroke:' + this.borderColour.toHexString() +
            ';, stroke-width: ' + this.borderWidth +
            '"></rect>';
}

/**
 * Used for board resizing
 * @returns {object}
 */
Rectangle.prototype.getCordinatesOfBottomRight = function() {
    return {
        xCord: this.xPos + this.xLen,
        yCord: this.yPos + this.yLen 
    }
}

/**
 * A Class used to store an array of SVG entities and generate them into valid DOM
 * @param {Number} _width 
 * @param {Number} _height 
 * @param {Boolean} overflows Controlls weather the SVG resizes to make sure that none of its elements overflow.
 */
var Maker = function(_width=500, _height=500, overflows=false) {
    this.footer = "</svg>"

    /**
     * @type {<svgShape>}
     */
    this.entities = [];

    this.width = _width;
    this.height = _height;

    this.overflows = overflows;

}

/**
 * Generates the correct SVG header
 */
Maker.prototype.generateHeader = function () {
    return "<svg version='1.1'"
                   + "baseProfile='full'"
                   + "width='" + this.width.toString() + "' height='" + this.height.toString() + "'"
                   + "xmlns=http://www.w3.org/2000/svg>";
}

/**
 * Stores the element in the svgShape class ready for the next render
 * @param {svgShape} element 
 */
Maker.prototype.addElement = function (element) {
        this.entities.push(element)
}

/**
 * @returns {String} Returns valid SVG dom of all of the shapes that it conatains
 */
Maker.prototype.getImage = function() {
    let DOM = ''
    let MaxX = this.width
    let MaxY = this.height

    for (let i = 0; i < this.entities.length; i++) {
        if (typeof this.entities[i] == "string") {
            DOM += this.entities[i]
        } else if (this.entities[i].nameOf == "svgShape") {
            DOM += this.entities[i].generateSVGString();
        } else {
            throw new TypeError("Unknown object passed to Maker");       
        }
        
        if (this.overflows) {
            if (MaxX < this.entities[i].getCordinatesOfBottomRight().xCord) {
                MaxX = this.entities[i].getCordinatesOfBottomRight().xCord;
            }
            
            if (MaxY < this.entities[i].getCordinatesOfBottomRight().yCord) {
                MaxY = this.entities[i].getCordinatesOfBottomRight().yCord;
            }
        }
        this.width = MaxX;
        this.height = MaxY;
    };
    return (this.generateHeader() + DOM + this.footer);
}


module.exports = {Maker, Rectangle}