import { DraftRules } from "../draft/draftRules.js";
import { Player, Move, BoardState, PiecePosition } from "../models.js";
import { GameBoard } from "../game/GameBoard.js";
import { AIPlayer } from "./base.js";
import randomAI from "./random.js";
import { minimaxAlphaBetaAI } from "./minimaxAB.js";




export default class MyopicMiniMax extends minimaxAlphaBetaAI {
    private ai;
    constructor(ai: AIPlayer = new randomAI(), ...difficulty: number[]) {
        super(1, ...difficulty);
        this.ai = ai;
    }
    override move(position: GameBoard, player: Player): Move {
        return Math.random() > this.difficulty_param(1) ? this.ai.move(position, player) : super.move(position, player);
    }

    draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition {
        return this.ai.draft(rules, board, player, points);
    }

}