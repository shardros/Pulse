const http = require('http');
const fs = require('fs');
const url = require('url');

const port = 8080;

const fileTypes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/javascript'
};

/**
 * This serves all the files in the directories located beneath the server, not great for security but I don't care so
 * on that front we are all good :-)
 * @type {module:http.Server}
 */
let server = http.createServer(function (req, res) {

    console.log('Requested: ', req.url);

    if (req.url == '/') {
        fs.readFile('./index.html', function(err, indexFile) {
            if (err) throw err;

            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(indexFile);
            res.end();
        })
    } else {
        fs.readFile('./' + req.url, function(err, data) {
            if (err) {
                console.log ('file not found: ' + req.url);
                res.writeHead(404, "Not Found");
                res.end();
            } else {
                //There was no error
                let dotPosFromEnd = req.url.lastIndexOf('.');
                let mimetype = 'text/plain';
                if (!(dotPosFromEnd == -1)) {
                    //Perform a look up for the text using the suffix in a dictionary
                    mimetype = fileTypes[req.url.substr(dotPosFromEnd)];
                }   

                res.setHeader('Content-type' , mimetype);
                res.end(data);
            }
        });
    }
}).listen(port);

console.log('Sever listening on port ', port);



/**http.createServer(function (req, res) {
    //Open a file on the server and return its content:
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(port);

 console.log('Listening on port ', port);
 */


