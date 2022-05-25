
import { PieceType, Player } from "../models.js";
import empty from "../positions/empty.js";
import empty2 from "../positions/empty.js";



export default () => {
    console.log("Testing empty board constructor (board clone).");
    const board1 = empty({ 'file': 8, 'rank': 8 });
    const board2 = empty2({ 'file': 8, 'rank': 8 });
    const board3 = empty({ 'file': 8, 'rank': 8 });
    console.assert(board1 !== board2);
    console.assert(board1 !== board3);
    console.assert(board2 !== board3);
    board1.pieces.push({ 'piece': PieceType.Bishop, 'player': Player.White, 'position': { 'file': 0, 'rank': 0 } });
    console.assert(board1.pieces.length !== board2.pieces.length);
    console.assert(board1.pieces.length !== board3.pieces.length);
}