import { GameBoard } from "../game/GameBoard.js";
import { checkGameState, cloneBoard, nextPlayer, updateWithMove } from "../game/gameModel.js";
import { Move, Player } from "../models.js";
import { evaluate, possibleMoves } from "./minimax.js";
import randomAI from "./random.js";

interface MoveVal {
    move: Move
    val: number
}

const DEBUG = false;

export class minimaxAlphaBetaAI extends randomAI {
    private skips = 0;
    private visits = 0;
    public val = 0;

    override move(position: GameBoard, player: Player): Move {
        this.skips = 0;
        this.visits = 0;
        const move = this.minimax(position, player, 0, this.difficulty_param(0), -Infinity, Infinity) as MoveVal;
        DEBUG && console.log("Eval:", move.val);
        DEBUG && console.log("Visited %d, skipped %d", this.visits, this.skips);
        this.val = move.val;
        return move.move;
    }

    private minimax(position: GameBoard, player: Player, depth: number, max_depth: number, alpha: number, beta: number): number | MoveVal {
        const state = checkGameState(position, player);
        // leaf node
        if (depth === max_depth || state.status !== "playing") {
            this.visits++;
            const val = evaluate(position, player, state);
            if (DEBUG) {
                console.log("Evaluation:", val);
                // printBoard(boardToState(position));
            }
            return val;
        }
        else {
            const moves = possibleMoves(position, player);
            const moveVal = moves.reduce<MoveVal>((prev, cur) => {
                if (alpha >= beta) {
                    this.skips++;
                    DEBUG && console.log("Skipped at depth", depth);
                    return prev;
                }
                const move_board = cloneBoard(position);
                updateWithMove(move_board, cur);
                const result = this.minimax(move_board, nextPlayer(player), depth + 1, max_depth, alpha, beta);
                const resultVal = typeof result === "number" ? result : result.val; // need to absorb leaf node values
                // get min/max move value
                if (player === Player.White && resultVal > alpha) {
                    DEBUG && console.log("Found better MAX: %d > %d", resultVal, alpha);
                    alpha = resultVal;
                    return { 'move': cur, 'val': resultVal };
                }
                else if (player === Player.Black && resultVal < beta) {
                    DEBUG && console.log("Found better MIN: %d < %d", resultVal, beta);
                    beta = resultVal;
                    return { 'move': cur, 'val': resultVal };
                }
                else {
                    return prev;
                }
            }, { 'move': { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 0 } }, 'val': player === Player.White ? alpha : beta });
            return moveVal;
        }
    }
}
