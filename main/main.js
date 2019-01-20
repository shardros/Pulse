import { boardDesigner } from 'scripts/boardDesigner';

var app = new Vue({
    el: '#app',
    data: {
        mousePos: 'Not Moved'
    }
});

var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();








/**

var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");

makeFullScreen(context);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

function makeFullScreen(context) {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
}

function draw(evt) {


    var pos = getMousePos(canvas, evt);

    for (let x = 0; x < (1000 % 10); x++) {
        for (let y = 0; y < (1000 % 10); y++) {
            context.fillStyle = "#0f0";
            context.fillRect (x, y, 10, 10);
        }
    }


    context.fillStyle = "#4db1ff";
    context.fillRect (pos.x, pos.y, 40, 40);
}

context.fillStyle = "#000";
for (let x = 0; x < (context.canvas.width % 10); x++) {
    for (let y = 0; y < (context.canvas.height % 10); y++) {
        context.fillRect(x,y, 10, 10);
    }
}

var isCanvasSupported = function(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

if(isCanvasSupported){
    var c = document.createElement('canvas');
    c.width = 400;
    c.height = 400;
    var cw = c.width;
    var ch = c.height;
    document.body.appendChild(c);
    var cl = new smoothTrail(c, cw, ch);

    setupRAF();
    cl.init();
}
*/