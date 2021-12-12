import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { boardState, GameBoard, Move, PieceType, Player, Rules } from "../models";
import { GamePiece, RuleSet } from "../rules/piece";
import { validMove } from "../rules/rules";
import { SimpleRuleSet } from "../rules/simplePieces";
import { pieceAtLocation } from "../utils";
import { requestMove } from "./makeMove";
import board from "../positions/normal_chess";

export async function runAIGame() {
    let CPU: AIPlayer = new randomAI(0);
    let ruleSet: RuleSet = new SimpleRuleSet();
    let gameState: GameBoard = ruleSet.initBoardPosition(board);

    let playerMove: Move | null = null;
    let AIMove: Move | null = null;
    while (true) {

        while (!playerMove) {
            try {
                playerMove = await requestMove();
                if (!validMove(gameState, playerMove, Player.White)) {
                    playerMove = null;
                    throw new Error("Invalid move");
                }
            } catch (error) {
                console.error("error:", error);
            }
        }
        console.log("Player:", playerMove);
        makeMove(gameState, playerMove);
        AIMove = CPU.move(gameState, Player.Black);
        console.log("AI:", AIMove);
        makeMove(gameState, AIMove);
        AIMove = null;
        playerMove = null;
    }
}

// moves a piece on a gameboard. Assumes the move is valid
export function makeMove(game: GameBoard, move: Move): boolean {
    let piece: GamePiece | undefined = pieceAtLocation(game, move.from);
    piece?.moveTo(move.to);
    return !!piece;
}

runAIGame();