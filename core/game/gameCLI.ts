import { AIPlayer } from "../ai/interface.js";
import randomAI from "../ai/random.js";
import { BoardState, Move, Player } from "../models.js";
import { RuleSet } from "../rules/piece.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { Game } from "./game.js";
import { boardToState, parseMove } from "./conversions.js";
import * as readline from "readline";
import {  printBoard } from "../utils.js";

export default async function runAIGameNode(board: BoardState) {
    const CPU: AIPlayer = new randomAI(0);
    const ruleSet: RuleSet = new SimpleRuleSet();

    const game: Game = new Game(ruleSet, board);

    while (game.gameStatus.status === "playing") {
        printBoard(boardToState(game.gameBoard));
        try {
            let result = game.makeMove(Player.White, await requestMove());

            while (!result.move) {
                console.log("Error:", result.reason);
                result = game.makeMove(Player.White, await requestMove());
            }
        } catch (e) {
            console.error(e);
        }
        game.makeMove(Player.Black, CPU.move(game.gameBoard, Player.Black));
    }
}


async function requestMove(): Promise<Move> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise<Move>(
        (resolve, reject) => {
            rl.question("Enter a move\n", answer => {
                rl.close();
                const move: Move | null = parseMove(answer);
                if (move) resolve(move);
                else reject(move);
            });
        }
    );
}
