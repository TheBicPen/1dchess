import { AIPlayer } from "../ai/interface.js";
import randomAI from "../ai/random.js";
import { BoardState, GameBoard, Move, Player } from "../models.js";
import { GamePiece, RuleSet } from "../rules/piece.js";
import { validMove, validMoveReason } from "../rules/rules.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { pieceAtLocation } from "../utils.js";
import { parseMove } from "./makeMove.js";

export interface moveResult {
    reason: string | null,
    move: Move | null
}

// move to front-end
export function runAIGame(ruleSet: RuleSet, CPU: AIPlayer, board: BoardState) {
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
            AIMove && makeMove(gameState, AIMove);
            return AIMove;
        }
    };
}

// moves a piece on a gameboard. Assumes the move is valid.
// this really should operate on the level of boardState, not gameBoard
export function makeMove(game: GameBoard, move: Move): boolean {
    let piece: GamePiece | undefined = pieceAtLocation(game, move.from);
    let capturePiece: GamePiece | undefined = pieceAtLocation(game, move.to);
    piece?.moveTo(move.to);
    if(capturePiece)
        capture(game, capturePiece);
    return !!piece;
}

function capture(game:GameBoard, piece: GamePiece) {
    game.gamePieces.splice(game.gamePieces.indexOf(piece), 1);
}