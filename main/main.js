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

    var pos = boardDesigner.getMousePos(c, evt);

    app.message = pos;

    boardDesigner.drawRect(pos.x, pos.y, gridSize, gridSize);
}
