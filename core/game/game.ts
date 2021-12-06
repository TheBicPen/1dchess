import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { boardState, GameBoard, Move, PieceType, Player, Rules } from "../models";
import { RuleSet } from "../rules/piece";
import { validMove } from "../rules/rules";
import { SimpleRuleSet } from "../rules/simplePieces";
import { requestMove } from "./makeMove";


export async function runAIGame() {
    let CPU: AIPlayer = new randomAI(0);
    let board: boardState = { "pieces": [{ 'piece': PieceType.Rook, 'player': Player.White, 'position': { 'rank': 0, 'file': 0 } }], "boardDimensions": { "rank": 8, "file": 8 } };
    let ruleSet: RuleSet = new SimpleRuleSet();
    let gameState: GameBoard = ruleSet.initBoardPosition(board);

    let move: Move | null = null;
    while (!move) {
        try {
            move = await requestMove();
            if (!validMove(gameState, move, Player.White)) {
                move = null;
                throw new Error("Invalid move");
            } else {
                console.log(move);
            }

        } catch (error) {
            console.error("error:", error);
        }
    }
}

runAIGame();