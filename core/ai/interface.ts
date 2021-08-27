import { GameBoard, Move, PiecePosition, Player, Position } from "../models";


export abstract class AIPlayer {
    private difficulty;
    constructor(difficulty: Number) {
        this.difficulty = difficulty;
    }
    abstract move(position: GameBoard, player: Player): Move;
}