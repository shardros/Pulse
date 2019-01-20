/**
 * A prototype that allows storage and manipulation of colour objects
 * @param {Number} red
 * @param {Number} green
 * @param {Number} blue
 */
var Colour = function(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
};

/** Add the colour values up in decimal, shifting the bits for each colour value to the left then adding them together
 *  The hex value is then converted to a string and the leading value is lost as it was just put there to absorb overflows
 */
Colour.prototype.toHexString = function() {
    return '#' + (0x10000 * this.red + 0x100 * this.green + this.blue + 0x1000000).toString(16).substr(1);
};
