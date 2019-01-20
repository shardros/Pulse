var http = require('http');

http.createServer(function (req, res) {
    res.write(index.html);
    res.end();
}).listen(8080);

console.log('listening');