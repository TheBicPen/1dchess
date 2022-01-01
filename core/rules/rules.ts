import { GameBoard, Move, Location, Player } from "../models.js";
import { pieceAtLocation } from "../utils.js";
import { GamePiece } from "./piece.js";


// check whether a move entered on a player's turn is valid. Do not call this from Piece.legalMove
export function validMove(board: GameBoard, move: Move, player: Player): boolean {
    let pieceToMove: GamePiece | undefined = pieceAtLocation(board, move.from);
    if (!pieceToMove)
        return false;
    return pieceToMove.state.player === player && pieceToMove.legalMove(move.to, board.rules.kingCheck, board);
}