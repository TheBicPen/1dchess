import { AIPlayer } from "../ai/base.js";
import randomAI from "../ai/random.js";
import { BoardState, Move, Player } from "../models.js";
import { RuleSet } from "../rules/piece.js";
import { Game, MoveStatus } from "./gameModel.js";
import { boardToState, parseMove, unparseMove } from "./conversions.js";
import * as readline from "readline";
import { printBoard } from "../utils.js";
import { evaluate, minimaxAI } from "../ai/minimax.js";

export default async function runAIGameNode(board: BoardState, ruleSet: RuleSet) {
    const CPU: AIPlayer = new minimaxAI(8);

    const game: Game = new Game(ruleSet, board);
    console.log("Starting AI game");

    while (game.gameStatus.status === "playing") {
        printBoard(boardToState(game.gameBoard));
        let result: MoveStatus | undefined = undefined;
        do {
            const move = await requestMove().catch(err => console.error(err));
            if (move) {
                result = game.makeMove(Player.White, move);
                if (result.reason) console.log(result.reason);
            }
        }
        while (!result?.move)
        console.log(evaluate(game.gameBoard, game.gameStatus.player));
        
        if (game.gameStatus.status !== "playing")
        break;
        printBoard(boardToState(game.gameBoard));
        let AIMove = CPU.move(game.gameBoard, Player.Black);
        console.log("AI move:");
        console.log(unparseMove(AIMove));
        game.makeMove(Player.Black, AIMove);
        console.log(evaluate(game.gameBoard, game.gameStatus.player));
    }
    console.log("GG!", game.gameStatus.status, game.gameStatus.player);
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
                else reject("Invalid move.");
            });
        }
    );
}
