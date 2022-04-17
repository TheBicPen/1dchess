import { DraftRules } from "../draft/draftRules.js";
import { Move, PiecePosition, Player, BoardState } from "../models.js";
import { GameBoard } from "../game/GameBoard";


export abstract class AIPlayer {
    protected difficulty: number;
    constructor(difficulty: number) {
        this.difficulty = difficulty;
    }
    abstract move(position: GameBoard, player: Player): Move;
    abstract draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition;
}
