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

    var parsedURL = url.parse(req.url, true);
    console.log('Requested: ', parsedURL.pathname);

    //Alows assignment specific urls to files. 
    switch (parsedURL.pathname) {
        case '/':
            
            fs.readFile('./main/index.html', function read(err, indexFile) {
                if (err) throw err;
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(indexFile);
                res.end();
            });

            break;

        case '/route':
            console.log('Route API called with parameters: ', parsedURL.query);
            console.log('Getting body contents');

            let requestBody = new String;
            req.on('data', chunk => {
                requestBody += chunk.toString(); // convert Buffer to string
            });
            
            req.on('end', () => {
                //The request has ended lets give them their new route
                console.log(requestBody);

                let reqObject = JSON.parse(requestBody);

                res.end(JSON.stringify({a: 1, "content": 'recived'}));
            });


            break;
        default:
            fs.readFile('./' + req.url, function(err, data) {
                if (err) {
                    console.log ('file not found: ' + req.url);
                    res.writeHead(404, "Not Found");
                    res.write('THERE WAS A 404')
                    res.end();
                } else { //There was no error

                    /**
                     * We now need to automatically seve the file however
                     * we don't know what mimetype (e.g. is it a text/html)
                     * this gets the file extentsion and assumes that is the
                     * value of the sign we want. We can do this by finding the 
                     * last dot in the file name, then looking that extention
                     * up in a dictionary.
                     */ 
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
