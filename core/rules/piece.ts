import { PiecePosition, Location, boardState, Move, GameBoard, Player, PieceType, Rules } from "../models";
import { enumeratePositions } from "../utils";
import { pieceToGamePiece } from "./simplePieces";


// legalMove assumes that the target move is valid in principle, i.e. target is on the board
export interface GamePiece {
    state: PiecePosition;
    moveTo(location: Location): void;
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean;
    getLegalMoves(considerCheck: boolean, position: GameBoard): Location[];
    locationToMove(to: Location): Move;
}


// how to instantiate a concrete game from an abstract board state
export abstract class RuleSet {
    abstract rules: Rules;
    abstract pieceToGamePiece(piece: PiecePosition): GamePiece;

    initBoardPosition(board: boardState): GameBoard {
        let gamePieces: GamePiece[] = board.pieces.map(p => this.pieceToGamePiece(p));
        return { 'rules': this.rules, 'gamePieces': gamePieces, 'boardDimensions': board.boardDimensions };
    };
}
