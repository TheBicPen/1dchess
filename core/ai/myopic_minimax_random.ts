import { DraftRules } from "../draft/draftRules.js";
import { Player, Move, BoardState, PiecePosition } from "../models.js";
import { GameBoard } from "../game/GameBoard";
import { AIPlayer } from "./interface.js";
import randomAI from "./random.js";
import { minimaxAI } from "./minimax.js";

const random = new randomAI(0);
const myopicMiniMax = new minimaxAI(1);

export default class MyopicMiniMaxRandom extends AIPlayer {
    move(position: GameBoard, player: Player): Move {
        return Math.random() > this.difficulty ? random.move(position, player) : myopicMiniMax.move(position, player);
    }

    draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition {
        return random.draft(rules, board, player, points);
    }

}