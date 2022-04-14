
import { PieceType, Player } from "../models";
import emptyBoard from "../positions/normal_empty";
import emptyBoard2 from "../positions/normal_empty";


export default () => {
    console.log("Testing deepClone.");
    const board1 = emptyBoard();
    const board2 = emptyBoard2();
    const board3 = emptyBoard();
    console.assert(board1 !== board2);
    console.assert(board1 !== board3);
    console.assert(board2 !== board3);
    board1.pieces.push({ 'piece': PieceType.Bishop, 'player': Player.White, 'position': { 'file': 0, 'rank': 0 } });
    console.assert(board1.pieces.length !== board2.pieces.length);
    console.assert(board1.pieces.length !== board3.pieces.length);
}