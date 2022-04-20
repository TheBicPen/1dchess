import { DraftRules } from "../draft/draftRules.js";
import { boardToState } from "../game/conversions.js";
import { checkGameState, cloneBoard, GameStatus, nextPlayer, updateWithMove } from "../game/gameModel.js";
import { Player, Move, BoardState, PiecePosition } from "../models.js";
import { GameBoard } from "../game/GameBoard";
import { countPieces, printBoard } from "../utils.js";
import { AIPlayer } from "./interface.js";
import randomAI from "./random.js";

interface MoveVal {
    move: Move
    val: number
}

const DEBUG = true;

export class minimaxAlphaBetaAI extends AIPlayer {
    private skips = 0;
    private visits = 0;

    move(position: GameBoard, player: Player): Move {
        this.skips = 0;
        this.visits = 0;

        const move = this.minimax(position, player, 0, this.difficulty, -Infinity, Infinity) as MoveVal;
        DEBUG && console.log("Eval:", move.val);
        DEBUG && console.log("Visited %d, skipped %d", this.visits, this.skips);
        return move.move;
    }

    draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition {
        return random.draft(rules, board, player, points);
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

const random = new randomAI(0);


function possibleMoves(position: GameBoard, player: Player): Move[] {
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
