const BoardRouter = require('./boardRouter');

import {BoardRouter} from './scripts/boardRouter';
import {Board, Cell, Net} from 'board';
import NetRouter from 'netRouter';
import Colour from 'colour';
import {Maker, Rectangle} from 'svg';


console.log('Initalizing router');

//Set the constants for the routing
const trackWidth = 10;
const boardWidth = 190;
const boardHeight = 90;
const numberOfLayers = 1;

//Create all of the objects that represent the exact problem that we are truing to solve
var board = new Board(boardWidth,boardHeight);

var netList = [];


let start = new Cell(50,4);
let end = new Cell(84,80);

netList.push(new Net(start, end));

start = new Cell(54,4);
end = new Cell(88,80);

netList.push(new Net(start, end));


start = new Cell(58,4);
end = new Cell(92,80);

netList.push(new Net(start, end));

start = new Cell(62,4);
end = new Cell(96,80);

netList.push(new Net(start, end));

start = new Cell(40,80);
end = new Cell(20,20);

netList.push(new Net(start, end));


start = new Cell(150,10);
end = new Cell(20,74);

netList.push(new Net(start, end));

BR = new BoardRouter(board, netList);

let topLeft = new Cell(0,0);
let bottomRight = new Cell(boardWidth-1,boardHeight-1);

BR.createKeepOut(topLeft,bottomRight);


console.log('Routing')
console.time('RoutingTime');

let tracks = BR.route();

console.timeEnd('RoutingTime')


