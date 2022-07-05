import { GameBoard } from "../../game/GameBoard.js";
import { Player, PieceType, Square, PiecePosition } from "../../models.js";
// import empty_board from "../../positions/normal_empty.js";
import starting_board from "../../positions/normal_chess.js";
import { GamePiece } from "../../rules/piece.js";
import { SimpleRuleSet } from "../../rules/simplePieces.js";
import { pieceAtLocation, pieceAtLocation2 } from "../../utils/chessUtils.js";


export default () => {

    console.log("Testing simple pawn moves.");
    const board = starting_board();
    const black_c_pawn = pieceAtLocation2(board, { 'file': 2, 'rank': 6 });
    const white_d_pawn = pieceAtLocation2(board, { 'file': 3, 'rank': 1 });
    const white_e_pawn = pieceAtLocation2(board, { 'file': 4, 'rank': 1 });
    console.assert(black_c_pawn);
    (black_c_pawn as PiecePosition).position.rank = 4;
    console.assert(white_d_pawn);
    (white_d_pawn as PiecePosition).position.rank = 3;
    console.assert(white_e_pawn);
    (white_e_pawn as PiecePosition).position.rank = 2;

    const gameBoard = new GameBoard(board, new SimpleRuleSet());

    const piece1 = pieceAtLocation(gameBoard, { 'file': 0, 'rank': 6 });
    const piece1moves = (piece1 as GamePiece).getLegalMoves(false, gameBoard);
    console.assert(piece1moves.length == 2);
    console.assert(piece1moves.some(m => m.file === 0 && m.rank === 5));
    console.assert(piece1moves.some(m => m.file === 0 && m.rank === 4));

    const piece2 = pieceAtLocation(gameBoard, { 'file': 1, 'rank': 6 });
    console.assert(piece2);
    const piece2moves = (piece2 as GamePiece).getLegalMoves(false, gameBoard);
    console.assert(piece2moves.length == 2);
    console.assert(piece2moves.some(m => m.file === 1 && m.rank === 5));
    console.assert(piece2moves.some(m => m.file === 1 && m.rank === 4));

    const piece3 = pieceAtLocation(gameBoard, { 'file': 1, 'rank': 1 });
    console.assert(piece3);
    const piece3moves = (piece3 as GamePiece).getLegalMoves(false, gameBoard);
    console.assert(piece3moves.length == 2);
    console.assert(piece3moves.some(m => m.file === 1 && m.rank === 2));
    console.assert(piece3moves.some(m => m.file === 1 && m.rank === 3));

    const piece4 = pieceAtLocation(gameBoard, { 'file': 0, 'rank': 1 });
    const piece4moves = (piece4 as GamePiece).getLegalMoves(false, gameBoard);
    console.assert(piece4moves.length == 2);
    console.assert(piece4moves.some(m => m.file === 0 && m.rank === 2));
    console.assert(piece4moves.some(m => m.file === 0 && m.rank === 3));

    // white e pawn is not on file 2 so it only has 1 move
    const piece5 = pieceAtLocation(gameBoard, { 'file': 4, 'rank': 2 });
    const piece5moves = (piece5 as GamePiece).getLegalMoves(false, gameBoard);
    console.assert(piece5moves.length == 1);
    console.assert(piece5moves.some(m => m.file === 4 && m.rank === 3));

    // white d pawn can capture black c pawn
    const piece6 = pieceAtLocation(gameBoard, { 'file': 3, 'rank': 3 });
    const piece6moves = (piece6 as GamePiece).getLegalMoves(false, gameBoard);
    console.assert(piece6moves.length == 2);
    console.assert(piece6moves.some(m => m.file === 3 && m.rank === 4));
    console.assert(piece6moves.some(m => m.file === 2 && m.rank === 4));
}
