
import { parseMove, parseSquare } from "../game/conversions.js";
import { Move, Square } from "../models.js";
import { moveEq } from "./utils/moveEq";
import { squareEq } from "./utils/squareEq";


export default () => {
    console.log("Testing square and move parsing.");

    let val: Square | null;

    val = parseSquare("a1");
    console.assert(squareEq(val, { 'file': 0, 'rank': 0 }));

    val = parseSquare("a2");
    console.assert(squareEq(val, { 'file': 0, 'rank': 1 }));

    val = parseSquare("b1");
    console.assert(squareEq(val, { 'file': 1, 'rank': 0 }));

    val = parseSquare("A1");
    console.assert(squareEq(val, { 'file': 0, 'rank': 0 }));

    val = parseSquare("z1");
    console.assert(squareEq(val, { 'file': 25, 'rank': 0 }));

    val = parseSquare("a9");
    console.assert(squareEq(val, { 'file': 0, 'rank': 8 }));

    val = parseSquare("9");
    console.assert(val === null);

    val = parseSquare("a");
    console.assert(val === null);

    val = parseSquare("a1-a2");
    console.assert(val === null);

    let move: Move | null;

    move = parseMove("a1-a2");
    console.assert(moveEq(move, { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 1 } }));

    move = parseMove("a1-a9");
    console.assert(moveEq(move, { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 8 } }));

    move = parseMove("a1-a2-");
    console.assert(!moveEq(move, { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 1 } }));

    move = parseMove("a1a2");
    console.assert(!moveEq(move, { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 1 } }));

    move = parseMove("");
    console.assert(!moveEq(move, { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 1 } }));

}

