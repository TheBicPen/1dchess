import { PiecePosition, PieceType, Player } from "../models.js";
import { countPieces } from "../utils.js";
import standard_board from "../positions/normal_chess.js";
import empty from "../positions/empty.js";


export default () => {
    console.log("Testing piece counter.");
    const blackPieces = (pos: PiecePosition) => pos.player === Player.Black;
    const rooks = (pos: PiecePosition) => pos.piece === PieceType.Rook;
    const board = standard_board();
    const board_empty = empty({ 'file': 8, 'rank': 8 });

    let val: number;

    val = countPieces(board, blackPieces);
    console.assert(val === 16);

    val = countPieces(board, rooks);
    console.assert(val === 4);

    val = countPieces(board_empty, blackPieces);
    console.assert(val === 0);

    val = countPieces(board_empty, rooks);
    console.assert(val === 0);
}