import { DraftRules } from "../draft/draftRules.js";
import { GameBoard, Player, Move, BoardState, PiecePosition, PieceType, Square } from "../models.js";
import { nextEmptySquare, randItem } from "../utils.js";
import { AIPlayer } from "./interface.js";


export default class randomAI extends AIPlayer {
    move(position: GameBoard, player: Player): Move {
        const a = position.gamePieces.filter(p => p.state.player === player);
        const b = a.flatMap(p => p.getLegalMoves(position.rules.kingCheck, position)
        .map(to => { return { 'from': p.state.position, 'to': to }; }));
        return randItem(b);
    }

    draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition {
        const piece: PieceType = randItem(Object.values(PieceType).filter(p =>
            rules.pieceCost[p] <= points /* && countPieces(board, (piecePos) => piecePos.player === player) < rules.pieceLimit */
        ));
        return { 'piece': piece, 'player': player, 'position': nextEmptySquare(board, player) as Square };
    }

}