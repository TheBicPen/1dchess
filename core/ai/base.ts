import { DraftRules } from "../draft/draftRules.js";
import { Move, PiecePosition, Player, BoardState } from "../models.js";
import { GameBoard } from "../game/GameBoard.js";


export abstract class AIPlayer {
    protected readonly difficulty: number[];
    constructor(...difficulty: number[]) {
        this.difficulty = difficulty;
    }
    protected difficulty_param(index: number): number {
        return this.difficulty[index] || 0;
    }
    abstract move(position: GameBoard, player: Player): Move;
    abstract draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition;
}
