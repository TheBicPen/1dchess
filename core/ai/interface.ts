import { GameBoard, Move, PiecePosition, Player, boardState } from "../models";


export abstract class AIPlayer {
    private difficulty: number;
    constructor(difficulty: number) {
        this.difficulty = difficulty;
    }
    abstract move(position: GameBoard, player: Player): Move;
}