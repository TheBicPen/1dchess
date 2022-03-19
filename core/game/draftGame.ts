import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { BoardState, GameBoard, Move, PiecePosition, Player } from "../models";
import board from "../positions/normal_empty";
import { RuleSet } from "../rules/piece";
import { validMove } from "../rules/rules";
import { SimpleRuleSet } from "../rules/simplePieces";
import { makeMove } from "./game";
import { runAIDraft } from "../draft/draft";
import draftRules1D from "../draft/1dDraftRules";
import { DraftRules } from "../draft/draftRules";
import { boardState, printBoard } from "../utils";


// no inversion of control - trying out the other way. See game.ts for the other approach
export default async function runDraftAIGame(requestMove: () => Promise<Move>, requestDraft: (rules: DraftRules, board: BoardState, player: Player, points: number) => Promise<PiecePosition>) {
    let CPU: AIPlayer = new randomAI(0);
    let ruleSet: RuleSet = new SimpleRuleSet();

    let initialBoard = await runAIDraft(draftRules1D, board, requestDraft);

    let gameState: GameBoard = ruleSet.initBoardPosition(initialBoard);

    let playerMove: Move | null = null;
    let AIMove: Move | null = null;
    while (true) {
        printBoard(boardState(gameState));
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
