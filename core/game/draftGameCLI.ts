import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { BoardState, GameBoard, Move, PiecePosition, PieceType, Player, Square } from "../models";
import board from "../positions/normal_empty";
import { RuleSet } from "../rules/piece";
import { validMove } from "../rules/rules";
import { SimpleRuleSet } from "../rules/simplePieces";
import { makeMove } from "./game";
import { parseMove } from "./makeMove";
import * as readline from 'readline';
import { runAIDraft } from "../draft/draft";
import draftRules1D from "../draft/1dDraftRules";
import { DraftRules } from "../draft/draftRules";
import { boardState, nextEmptySquare, parsePiece, printBoard } from "../utils";

export default async function runDraftAIGameNode() {
    let CPU: AIPlayer = new randomAI(0);
    let ruleSet: RuleSet = new SimpleRuleSet();
    
    let theBoard = await runAIDraft(draftRules1D, board, requestDraft);

    let gameState: GameBoard = ruleSet.initBoardPosition(theBoard);

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


async function requestMove(): Promise<Move> {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise<Move>(
        (resolve, reject) => {
            rl.question("Enter a move\n", answer => {
                rl.close();
                let move: Move | null = parseMove(answer);
                if (move) resolve(move);
                else reject(move);
            });
        }
    );
}


async function requestDraft(rules: DraftRules, board: BoardState, player: Player, points: number): Promise<PiecePosition> {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise<PiecePosition>(
        (resolve, reject) => {
            rl.question(`Choose a piece. You have ${points} points left\n`, answer => {
                rl.close();
                let piece = parsePiece(answer);
                if (piece) resolve({'piece': piece, 'player': player, 'position': nextEmptySquare(board, player) as Square});
                else reject(piece);
            });
        }
    );
}



runDraftAIGameNode();
