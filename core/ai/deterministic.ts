import { DraftRules } from "../draft/draftRules.js";
import { GameBoard } from "../game/GameBoard.js";
import { BoardState, Move, PiecePosition, PieceType, Player, Square } from "../models.js";
import { nextEmptySquare } from "../utils/chessUtils.js";
import { AIPlayer } from "./base.js";


export default class determinsticAI extends AIPlayer {
    private randomState = this.difficulty_param(0) || 1;

    move(position: GameBoard, player: Player): Move {
        const b = position.gamePieces.filter(p => p.state.player === player)
            .flatMap(p => p.getLegalMoves(position.rules.rules.kingCheck, position)
                .map(to => { return { 'from': p.state.position, 'to': to }; }));
        return b[Math.floor(this.prng() * b.length)] as Move;
    }

    draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition {
        const pieces = Object.values(PieceType).filter(p => rules.pieceCost[p] <= points);
        const piece = pieces[Math.floor(this.prng() * pieces.length)] as PieceType;
        return { 'piece': piece, 'player': player, 'position': nextEmptySquare(board, player) as Square };
    }

    // simple PRNG taken from https://stackoverflow.com/a/19303725/9074788
    private prng() {
        const x = Math.sin(this.randomState++) * 10000;
        return x - Math.floor(x);
    }
}