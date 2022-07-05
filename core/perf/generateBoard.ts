import { BoardState, PieceType, Player, Square } from "../models.js";
import empty from "../positions/empty.js";
import { nextEmptySquare, randItem } from "../utils/chessUtils.js";


export default (dim: Square, pieces: number, symmetric: boolean): BoardState => {
    const board = empty(dim);
    board.pieces.push({ 'piece': PieceType.King, 'player': Player.White, 'position': nextEmptySquare(board, Player.White) as Square });
    board.pieces.push({ 'piece': PieceType.King, 'player': Player.Black, 'position': nextEmptySquare(board, Player.Black) as Square });
    while (pieces > 0) {
        const piece = randItem(Object.values(PieceType));
        try {
            if (symmetric) {
                board.pieces.push({ 'piece': piece, 'player': Player.White, 'position': nextEmptySquare(board, Player.White) as Square });
                board.pieces.push({ 'piece': piece, 'player': Player.Black, 'position': nextEmptySquare(board, Player.Black) as Square });
            }
            else {
                board.pieces.push({ 'piece': piece, 'player': Player.White, 'position': nextEmptySquare(board, Player.White) as Square });
                const piece2 = randItem(Object.values(PieceType));
                board.pieces.push({ 'piece': piece2, 'player': Player.Black, 'position': nextEmptySquare(board, Player.Black) as Square });
            }
            pieces--;
        } catch (error) {
            console.error(error);
            break;
        }
    }
    return board;
}