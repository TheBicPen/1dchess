import { Square } from "../models.js";
import { blocked } from "../utils.js";
import emptyBoard from "../positions/normal_empty.js";
import startingBoard from "../positions/normal_chess.js";

const loc1: Square = { 'rank': 1, 'file': 2 };
const loc2: Square = { 'rank': 1, 'file': 5 };
const loc3: Square = { 'rank': 6, 'file': 2 };
const loc4: Square = { 'rank': 3, 'file': 5 };
const loc5: Square = { 'rank': 8, 'file': 8 };
const loc6: Square = { 'rank': 1, 'file': 1 };
const loc7: Square = { 'rank': 8, 'file': 1 };
const loc8: Square = { 'rank': 1, 'file': 8 };

// this test is mostly to see the squares `blocked` considers.
export default () => {
    console.log("Testing blocked pieces. Bad test.");
    const board1 = emptyBoard();
    const board2 = startingBoard();

    console.assert(!blocked(board1, loc1, loc2), "", loc1, loc2);    // empty string to prevent object being used as format

    console.assert(!blocked(board1, loc1, loc3), "", loc1, loc3);

    console.assert(!blocked(board1, loc1, loc4), "", loc1, loc4);

    console.assert(!blocked(board1, loc4, loc1), "", loc4, loc1);

    console.assert(!blocked(board1, loc2, loc1), "", loc2, loc1);

    console.assert(!blocked(board1, loc3, loc1), "", loc3, loc1);

    console.assert(!blocked(board1, loc1, loc1), "", loc1, loc1);

    console.assert(!blocked(board1, loc6, loc5), "", loc6, loc5);

    console.assert(!blocked(board1, loc7, loc8), "", loc7, loc8);

    console.assert(blocked(board2, loc1, loc2), "", loc1, loc2);

}