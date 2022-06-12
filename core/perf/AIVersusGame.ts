import { AIPlayer } from "../ai/base.js";
import { Game, GameStatus } from "../game/gameModel.js";
import { BoardState, Player } from "../models.js";
import { RuleSet } from "../rules/piece.js";


// both players make a ply -> 1 move
const MAX_MOVES = 100;

export default function runAIVersus(board: BoardState, ruleSet: RuleSet, cpu1: AIPlayer, cpu2: AIPlayer): [GameStatus, number] {

    const game: Game = new Game(board, ruleSet);
    let move_count = 0;
    while (game.gameStatus.status === "playing" && move_count < MAX_MOVES) {
        game.makeMove(Player.White, cpu1.move(game.gameBoard, Player.White));
        if (game.gameStatus.status !== "playing")
            break;
        game.makeMove(Player.Black, cpu2.move(game.gameBoard, Player.Black));
        move_count++;
    }
    if (move_count === MAX_MOVES)
        game.gameStatus.status = "draw";
    return [game.gameStatus, move_count];
}
