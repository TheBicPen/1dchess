import { GameBoard, Move, PiecePosition, Player, boardState } from "../models";


export abstract class AIPlayer {
    private difficulty;
    constructor(difficulty: Number) {
        this.difficulty = difficulty;
    }
    abstract move(position: GameBoard, player: Player): Move;
}