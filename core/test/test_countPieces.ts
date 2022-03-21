import { PiecePosition, PieceType, Player } from "../models.js";
import { countPieces } from "../utils.js";
import standard_board from "../positions/normal_chess.js";
import empty_board from "../positions/normal_empty.js";


export default () => {
    console.log("Testing piece counter.");
    const blackPieces = (pos: PiecePosition) => pos.player === Player.Black;
    const rooks = (pos: PiecePosition) => pos.piece === PieceType.Rook;

    let val: number;
    
    val = countPieces(standard_board, blackPieces);
    console.assert(val === 16);

    val = countPieces(standard_board, rooks);
    console.assert(val === 4);

    val = countPieces(empty_board, blackPieces);
    console.assert(val === 0);

    val = countPieces(empty_board, rooks);
    console.assert(val === 0);
}