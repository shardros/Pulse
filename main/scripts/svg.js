var http = require('http');

svgMaker = class {
    constructor (_width="300", _height="200") {
        this.header = "<svg version='1.1'"
                   + "baseProfile='full'"
                   + "width='400' height='500'"
                   + "xmlns=http://www.w3.org/2000/svg>"
        this.footer = "</svg>"
        this.entities = [];
    }

    addelement(element) {
        this.entities.push(element)
    }

    getImage() {
        let e = ''
        for(let i = 0; i < this.entities.length; i++) {e += this.entities[i]};
        return (this.header + e + this.footer);
    }
}

http.createServer(function (req, res) {
    mySvgMaker = new svgMaker;
    res.write('<html><body>');
    mySvgMaker.addelement('<rect width="20" height="50" style="fill:rgb(255,0,255);stroke-width:3;stroke:rgb(0,0,0)"/>')
    res.write(mySvgMaker.getImage());
    res.write('</body></html>');
    res.end();
    console.log('page loaded')
    
}).listen(8080);

console.log('server listening on port 8080')

module.exports = {svgMaker}