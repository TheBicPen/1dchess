import { AIPlayer } from "../ai/interface.js";
import randomAI from "../ai/random.js";
import { BoardState, GameBoard, Move, PieceType, Player } from "../models.js";
import { GamePiece, RuleSet } from "../rules/piece.js";
import { validMove, validMoveWithReason } from "../rules/rules.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { boardState, pieceAtLocation } from "../utils.js";
import { parseMove } from "./makeMove.js";

export interface moveResult {
    reason: string | null,
    move: Move | null,
}

export type status = "playing" | Player.Black | Player.White | "draw";

export interface moveStatus extends moveResult {
    status: status
};

// move to front-end
export function runAIGame(ruleSet: RuleSet, CPU: AIPlayer, board: BoardState, /* callback: (status: string) => void */) {
    let gameState: GameBoard = ruleSet.initBoardPosition(board);
    let gameStatus: status = "playing";

    return {
        'playerMove': function (move: string): moveStatus {
            let playerMove: Move | null = parseMove(move);
            if (!playerMove)
                return { 'move': null, 'reason': 'Parsing error', 'status': gameStatus };
            let moveResult: moveResult = validMoveWithReason(gameState, playerMove, Player.White);
            if (!moveResult.move) {
                return { ...moveResult, 'status': gameStatus };
            }

            console.log("Player:", playerMove);
            makeMove(gameState, playerMove);
            gameStatus = checkGameState(gameState);
            return { ...moveResult, 'status': gameStatus };
        },
        'AIMove': function (): moveStatus {
            let AIMove: Move | null = CPU.move(gameState, Player.Black);
            console.log("AI:", AIMove);
            AIMove && makeMove(gameState, AIMove);
            gameStatus = checkGameState(gameState);
            return { reason: null, move: AIMove, 'status': gameStatus };
        }
    };
}

// moves a piece on a gameboard. Assumes the move is valid.
// this really should operate on the level of boardState, not gameBoard
export function makeMove(game: GameBoard, move: Move): boolean {
    let piece: GamePiece | undefined = pieceAtLocation(game, move.from);
    let capturePiece: GamePiece | undefined = pieceAtLocation(game, move.to);
    piece?.moveTo(move.to);
    if (capturePiece)
        capture(game, capturePiece);
    return !!piece;
}

export function checkGameState(game: GameBoard): status {
    let whiteKing: boolean = game.gamePieces.some(p => p.state.player == Player.White && p.state.piece == PieceType.King);
    let blackKing: boolean = game.gamePieces.some(p => p.state.player == Player.Black && p.state.piece == PieceType.King);
    let whiteMove: boolean = game.gamePieces.some(p => p.state.player == Player.White && p.getLegalMoves(game.rules.kingCheck, game).length > 0);
    let blackMove: boolean = game.gamePieces.some(p => p.state.player == Player.Black && p.getLegalMoves(game.rules.kingCheck, game).length > 0);
    if (whiteKing && blackKing && whiteMove && blackMove)
        return "playing";
    else if (whiteKing && whiteMove)
        return Player.White;
    else if (blackKing && blackMove)
        return Player.Black;
    else return "draw";
}

function capture(game: GameBoard, piece: GamePiece) {
    game.gamePieces.splice(game.gamePieces.indexOf(piece), 1);
}