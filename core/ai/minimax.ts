import { DraftRules } from "../draft/draftRules.js";
import { boardToState } from "../game/conversions.js";
import { checkGameState, cloneBoard, nextPlayer, updateWithMove } from "../game/gameModel.js";
import { Player, Move, BoardState, PiecePosition } from "../models.js";
import { GameBoard } from "../game/GameBoard";
import { countPieces, printBoard } from "../utils.js";
import { AIPlayer } from "./interface.js";
import randomAI from "./random.js";


interface moveVal {
    move: Move | undefined
    val: number
}

export class minimaxAI extends AIPlayer {
    move(position: GameBoard, player: Player): Move {
        const move = this._minimax(position, player, 0, this.difficulty);
        return move.move as Move;
    }

    draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition {
        return random.draft(rules, board, player, points);
    }

    _minimax(position: GameBoard, player: Player, depth: number, max_depth: number): moveVal {
        if (depth === max_depth) {
            const val = evaluate(position, player);
            console.log("Evaluation:");
            printBoard(boardToState(position));
            console.log(val);
            return { 'val': val, 'move': undefined };
        }
        const moves = possibleMoves(position, player);
        const moveVals = moves.map(move => {
            const move_board = cloneBoard(position);
            updateWithMove(move_board, move);
            // no tail recursion - sad
            const moveValMaybe = this._minimax(move_board, nextPlayer(player), depth + 1, max_depth);
            if (!moveValMaybe.move)
                moveValMaybe.move = move;
            return moveValMaybe;
        });
        // get min/max move value
        if (player === Player.White)
            return moveVals.reduce((prev, cur) => cur.val > prev.val ? cur : prev, { 'val': -1e9, 'move': undefined });
        else
            return moveVals.reduce((prev, cur) => cur.val < prev.val ? cur : prev, { 'val': 1e9, 'move': undefined });
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
export function evaluate(position: GameBoard, player: Player): number {
    const board = boardToState(position);
    const max_val = board.boardDimensions.file * board.boardDimensions.rank;
    const state = checkGameState(position, player);
    if (state.status === "draw")
        return 0;
    else if (state.status === "loss")
        return player === Player.White ? -max_val : max_val;
    else
        return 2 * (position.gamePieces.length / 2 - countPieces(board, p => p.player === Player.Black));
}
