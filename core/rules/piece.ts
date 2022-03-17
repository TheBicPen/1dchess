import { PiecePosition, Square, BoardState, Move, GameBoard, Rules } from "../models.js";


// legalMove only checks the piece's movement rules. The target location must be on the board
export interface GamePiece {
    state: PiecePosition;
    moveTo(location: Square): void;
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean;
    getLegalMoves(considerCheck: boolean, position: GameBoard): Square[];
    locationToMove(to: Square): Move;
}


// how to instantiate a concrete game from an abstract board state
export abstract class RuleSet {
    abstract rules: Rules;
    abstract pieceToGamePiece(piece: PiecePosition): GamePiece;

    initBoardPosition(board: BoardState): GameBoard {
        let gamePieces: GamePiece[] = board.pieces.map(p => this.pieceToGamePiece(p));
        return { 'rules': this.rules, 'gamePieces': gamePieces, 'boardDimensions': board.boardDimensions };
    };
}
