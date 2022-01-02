import { AIPlayer } from "../ai/interface.js";
import randomAI from "../ai/random.js";
import { GameBoard, Move, Player } from "../models.js";
import { GamePiece, RuleSet } from "../rules/piece.js";
import { validMove, validMoveReason } from "../rules/rules.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { pieceAtLocation } from "../utils.js";
import { parseMove } from "./makeMove.js";
import board from "../positions/normal_chess.js";

export interface moveResult {
    reason: string | null,
    move: Move | null
}

// move to front-end
export function runAIGame() {
    let CPU: AIPlayer = new randomAI(0);
    let ruleSet: RuleSet = new SimpleRuleSet();
    let gameState: GameBoard = ruleSet.initBoardPosition(board);


    return {
        'playerMove': function (move: string): moveResult {
            let playerMove: Move | null = parseMove(move);
            if (!playerMove)
                return { 'move': null, 'reason': 'Parsing error' };
            let moveResult: moveResult = validMoveReason(gameState, playerMove, Player.White);
            if (!moveResult.move) {
                return moveResult;
            }

            console.log("Player:", playerMove);
            makeMove(gameState, playerMove);
            return moveResult;
        },
        'AIMove': function () {
            let AIMove: Move | null = CPU.move(gameState, Player.Black);
            console.log("AI:", AIMove);
            makeMove(gameState, AIMove);
            return AIMove;
        }
    };
}

// moves a piece on a gameboard. Assumes the move is valid
export function makeMove(game: GameBoard, move: Move): boolean {
    let piece: GamePiece | undefined = pieceAtLocation(game, move.from);
    piece?.moveTo(move.to);
    return !!piece;
}

runAIGame();