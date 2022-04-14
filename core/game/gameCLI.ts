import { AIPlayer } from "../ai/interface.js";
import randomAI from "../ai/random.js";
import { BoardState, Move, Player } from "../models.js";
import { RuleSet } from "../rules/piece.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { Game, MoveStatus } from "./gameModel.js";
import { boardToState, parseMove, unparseMove } from "./conversions.js";
import * as readline from "readline";
import { printBoard } from "../utils.js";

export default async function runAIGameNode(board: BoardState) {
    const CPU: AIPlayer = new randomAI(0);
    const ruleSet: RuleSet = new SimpleRuleSet();

    const game: Game = new Game(ruleSet, board);
    console.log("Starting AI game");

    while (game.gameStatus.status === "playing") {
        printBoard(boardToState(game.gameBoard));
        let result: MoveStatus | undefined = undefined;
        do {
            const move = await requestMove().catch(err => console.error(err));
            if (move) result = game.makeMove(Player.White, move);
        }
        while (!result?.move)
        
        let AIMove = CPU.move(game.gameBoard, Player.Black);
        console.log("AI move:");
        console.log(unparseMove(AIMove));
        game.makeMove(Player.Black, AIMove);
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
                else reject("Invalid move.");
            });
        }
    );
}
