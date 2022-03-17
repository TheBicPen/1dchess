import { DraftRules } from "../draft/draftRules.js";
import { GameBoard, Move, PiecePosition, Player, BoardState } from "../models.js";


export abstract class AIPlayer {
    private difficulty: number;
    constructor(difficulty: number) {
        this.difficulty = difficulty;
    }
    abstract move(position: GameBoard, player: Player): Move;
    abstract draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition;
}