import { GameBoard, Location } from "../models";
import { blocked } from "../utils";


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
blocked(emptyBoard, loc1, loc3);
blocked(emptyBoard, loc1, loc4);
blocked(emptyBoard, loc2, loc1);
blocked(emptyBoard, loc3, loc1);
blocked(emptyBoard, loc1, loc1);
blocked(emptyBoard, loc6, loc5);
blocked(emptyBoard, loc7, loc8);