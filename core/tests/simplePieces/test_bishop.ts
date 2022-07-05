import { GameBoard } from "../../game/GameBoard.js";
import { Player, PieceType, Square } from "../../models.js";
import empty from "../../positions/empty.js";
import { GamePiece } from "../../rules/piece.js";
import { SimpleRuleSet } from "../../rules/simplePieces.js";
import { pieceAtLocation, printBoard } from "../../utils/chessUtils.js";


export default () => {

    console.log("Testing Bishop moves.");
    const board = empty({ 'file': 8, 'rank': 8 });
    const loc = { 'file': 2, 'rank': 3 };
    board.pieces.push({ 'piece': PieceType.Bishop, 'player': Player.White, 'position': loc });
    const gameBoard = new GameBoard(board, new SimpleRuleSet());
    const piece = pieceAtLocation(gameBoard, loc);
    console.assert(piece);
    const moves = (piece as GamePiece).getLegalMoves(false, gameBoard);
    console.assert(moves.length === validMoves.length);
    // moves.push({'rank': 6, 'file': 3});  // test extra
    moves.forEach(m =>
        console.assert(validMoves.some(vm => m.file === vm.file && m.rank === vm.rank))
    );
    // moves.forEach(m => board.pieces.push({ 'piece': PieceType.Bishop, 'player': Player.White, 'position': m }));
    // printBoard(board);   // print moves
}

const validMoves: Square[] = [
    { 'file': 1, 'rank': 2 },
    { 'file': 0, 'rank': 1 },
    { 'file': 1, 'rank': 4 },
    { 'file': 0, 'rank': 5 },
    { 'file': 3, 'rank': 2 },
    { 'file': 4, 'rank': 1 },
    { 'file': 5, 'rank': 0 },
    { 'file': 3, 'rank': 4 },
    { 'file': 4, 'rank': 5 },
    { 'file': 5, 'rank': 6 },
    { 'file': 6, 'rank': 7 },
]
