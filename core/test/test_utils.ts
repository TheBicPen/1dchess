import { GameBoard, Location } from "../models.js";
import { blocked } from "../utils.js";


const loc1: Location = {'rank': 1, 'file': 2};
const loc2: Location = {'rank': 1, 'file': 5};
const loc3: Location = {'rank': 6, 'file': 2};
const loc4: Location = {'rank': 3, 'file': 5};
const loc5: Location = {'rank': 8, 'file': 8};
const loc6: Location = {'rank': 1, 'file': 1};
const loc7: Location = {'rank': 8, 'file': 1};
const loc8: Location = {'rank': 1, 'file': 8};

const emptyBoard: GameBoard = {boardDimensions:loc5, gamePieces: [], rules: {kingCheck: false}};

blocked(emptyBoard, loc1, loc2);
console.debug();
blocked(emptyBoard, loc1, loc3);
console.debug();
blocked(emptyBoard, loc1, loc4);
console.debug();
blocked(emptyBoard, loc4, loc1);
console.debug();
blocked(emptyBoard, loc2, loc1);
console.debug();
blocked(emptyBoard, loc3, loc1);
console.debug();
blocked(emptyBoard, loc1, loc1);
console.debug();
blocked(emptyBoard, loc6, loc5);
console.debug();
blocked(emptyBoard, loc7, loc8);
console.debug();