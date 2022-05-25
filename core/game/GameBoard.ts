import { GamePiece, RuleSet } from "../rules/piece.js";
import { BoardState, Square } from "../models.js";

// concrete, aware of rules and piece movement
export class GameBoard {
    boardDimensions: Square;
    gamePieces: GamePiece[];
    rules: RuleSet;

    constructor(position: BoardState, rules: RuleSet) {
        this.boardDimensions = position.boardDimensions;
        this.rules = rules;
        this.gamePieces = position.pieces.map(p => rules.pieceToGamePiece(p));
    }
}
