import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { GameBoard, Move, Player } from "../models";
import board from "../positions/normal_chess";
import { RuleSet } from "../rules/piece";
import { validMove } from "../rules/rules";
import { SimpleRuleSet } from "../rules/simplePieces";
import { makeMove } from "./game";
import { parseMove } from "./makeMove";
import * as readline from 'readline';

export default async function runAIGameNode() {
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

runAIGameNode();