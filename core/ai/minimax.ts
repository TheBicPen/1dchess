import { boardToState } from "../game/conversions.js";
import { GameBoard } from "../game/GameBoard";
import { checkGameState, cloneBoard, GameStatus, nextPlayer, updateWithMove } from "../game/gameModel.js";
import { Move, Player } from "../models.js";
import { countPieces, printBoard } from "../utils.js";
import randomAI from "./random.js";

interface MoveVal {
    move: Move
    val: number
}

const DEBUG = false;

export class minimaxAI extends randomAI {
    public val = 0;

    override move(position: GameBoard, player: Player): Move {
        const move = this._minimax(position, player, 0, this.difficulty_param(0)) as MoveVal;
        DEBUG && console.log("Eval:", move.val);
        this.val = move.val;
        return move.move;
    }


    _minimax(position: GameBoard, player: Player, depth: number, max_depth: number): number | MoveVal {
        const state = checkGameState(position, player);
        // leaf node
        if (depth === max_depth || state.status !== "playing") {
            const val = evaluate(position, player, state);
            if (DEBUG) {
                console.log("Evaluation:");
                printBoard(boardToState(position));
                console.log(val);
            }
            return val;
        }
        else if (depth === 0) {
            const moves = possibleMoves(position, player);
            const moveVals = moves.map(move => {
                const move_board = cloneBoard(position);
                updateWithMove(move_board, move);
                DEBUG && console.log("move at depth", depth, move);
                return { 'move': move, 'val': this._minimax(move_board, nextPlayer(player), depth + 1, max_depth) as number };
            });
            // get min/max move value
            if (player === Player.White) {
                DEBUG && console.log("Finding MAX");
                return moveVals.reduce((prev, cur) => cur.val > prev.val ? cur : prev);
            }
            else {
                DEBUG && console.log("Finding MIN");
                return moveVals.reduce((prev, cur) => cur.val < prev.val ? cur : prev);
            }
        }
        else {
            const moves = possibleMoves(position, player);
            const moveVals = moves.map(move => {
                const move_board = cloneBoard(position);
                updateWithMove(move_board, move);
                DEBUG && console.log("move at depth", depth, move);
                return this._minimax(move_board, nextPlayer(player), depth + 1, max_depth) as number;
            });
            return player === Player.White ? Math.max(...moveVals) : Math.min(...moveVals);
        }
    }
}


export function possibleMoves(position: GameBoard, player: Player): Move[] {
    return position.gamePieces
        .filter(p => p.state.player === player)
        .flatMap(p => p.getLegalMoves(position.rules.rules.kingCheck, position)
            .map(to => { return { 'from': p.state.position, 'to': to }; }));
}

// evaluate game state based on advantage for White
export function evaluate(position: GameBoard, player: Player, status?: GameStatus): number {
    status = status || checkGameState(position, player);
    const board = boardToState(position);
    const max_val = board.boardDimensions.file * board.boardDimensions.rank;
    if (status.status === "draw")
        return 0;
    else if (status.status === "loss")
        return player === Player.White ? -max_val : max_val;
    else
        return 2 * (position.gamePieces.length / 2 - countPieces(board, p => p.player === Player.Black));
}
