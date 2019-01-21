/**
var imported = document.createElement('script');
imported.src = '/path/to/imported/script';
document.head.appendChild(imported);
*/

const gridSize = 50;

let app = new Vue({
    el: '#app',
    data: {
        message: 'Not Moved'
    }
});


var c = document.getElementById("Canvas");

let boardDesigner = new BD(c);


function draw(evt) {

    var pos = boardDesigner.getMousePos(evt);

    app.message = boardDesigner.getMousePos(evt);

    boardDesigner.drawRect(pos.x, pos.y, gridSize, gridSize);
}
