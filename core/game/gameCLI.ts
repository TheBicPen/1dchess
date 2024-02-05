import { AIPlayer } from "../ai/base.js";
import { BoardState, Move, Player } from "../models.js";
import { RuleSet } from "../rules/piece.js";
import { Game, MoveStatus } from "./gameModel.js";
import { boardToState, parseMove, unparseMove } from "./conversions.js";
import * as readline from "readline";
import { printBoard } from "../utils/chessUtils.js";
import { evaluate, minimaxAI } from "../ai/minimax.js";
import { ChessClock } from "./chessClock.js";
import { PollablePromise } from "../utils/PollablePromise.js";
import { seconds } from "../utils/Timer.js";

export default async function runAIGameNode(board: BoardState, ruleSet: RuleSet) {
    const CPU: AIPlayer = new minimaxAI(2);

    const game: Game = new Game(board, ruleSet, { 'increment': 5, 'timeSeconds': 5 });
    console.log("Starting AI game");

    while (game.checkStatus().status === "playing") {
        printBoard(boardToState(game.gameBoard));
        let result: MoveStatus | undefined = undefined;
        while (game.checkStatus().status === "playing" && (!result || !result.move)) {
            const request = new PollablePromise(requestMove(game), game.clock!.remaining(game.checkStatus().player));
            try {
                const move: Move = await request.polling(1000, () => printTime(game.clock!, game.checkStatus().player));
                result = game.makeMove(Player.White, move);
            } catch (error) {
                console.error(error);
            }
        }


        console.log(evaluate(game.gameBoard, game.checkStatus().player));

        if (game.checkStatus().status !== "playing")
            break;
        printBoard(boardToState(game.gameBoard));
        const AIMove = CPU.move(game.gameBoard, Player.Black);
        console.log("AI move:");
        console.log(unparseMove(AIMove));
        game.makeMove(Player.Black, AIMove);
        console.log(evaluate(game.gameBoard, game.checkStatus().player));
    }
    console.log("GG!", game.checkStatus().status, game.checkStatus().player);
}

function printTime(clock: ChessClock, player?: Player) {
    if (player !== Player.Black) console.log("Time White:", seconds(clock.timers.w.remaining()));
    if (player !== Player.White) console.log("Time Black:", seconds(clock.timers.b.remaining()));
}


function requestMove(_game: Game): Promise<Move> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise<Move>(
        (resolve, reject) => {
            rl.question(`Enter a move.\n`, answer => {
                rl.close();
                const move: Move | null = parseMove(answer);
                if (move) resolve(move);
                else reject("Invalid move.");
            });
        }
    );
}
