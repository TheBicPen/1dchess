import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { BoardState, Move, Player } from "../models";
import { RuleSet } from "../rules/piece";
import { SimpleRuleSet } from "../rules/simplePieces";
import { Game } from "./game";
import { parseMove } from "./makeMove";
import * as readline from 'readline';
import { boardToState, printBoard } from "../utils";

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
