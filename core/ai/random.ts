import { DraftRules } from "../draft/draftRules.js";
import { GameBoard, Player, Move, BoardState, PiecePosition, PieceType, Square } from "../models.js";
import { countPieces, nextEmptySquare, randItem } from "../utils.js";
import { AIPlayer } from "./interface.js";


export default class randomAI extends AIPlayer {
    move(position: GameBoard, player: Player): Move {
        return randItem(position.gamePieces
            .filter(p => p.state.player === player)
            .flatMap(p => p.getLegalMoves(position.rules.kingCheck, position)
                .map((to) => ({ 'from': p.state.position, 'to': to }))));
    }

    draft(rules: DraftRules, board: BoardState, player: Player, points: number): PiecePosition {
        let piece: PieceType = randItem(Object.values(PieceType).filter(p =>
            rules.pieceCost[p] <= points /* && countPieces(board, (piecePos) => piecePos.player === player) < rules.pieceLimit */
        ));
        return { 'piece': piece, 'player': player, 'position': nextEmptySquare(board, player) as Square };
    }

}