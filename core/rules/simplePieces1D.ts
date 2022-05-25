import { boardToState } from "../game/conversions.js";
import { Square, Player, PieceType, Rules, PiecePosition } from "../models.js";
import { GameBoard } from "../game/GameBoard.js";
import { blocked, blockedSquares, pieceAtLocation } from "../utils.js";
import { GamePiece, RuleSet } from "./piece.js";
import {
    SimplePiece,
    SimpleKing as SimpleKing1D,
    SimplePawn as SimplePawn1D,
    SimpleRook as SimpleRook1D
} from "./simplePieces.js";

export class SimpleRuleSet1D implements RuleSet {
    rules: Rules = { 'kingCheck': false };
    pieceToGamePiece = function pieceToGamePiece(piece: PiecePosition): GamePiece {
        return piece.piece === PieceType.Bishop ? new SimpleBishop1D(piece.position, piece.player)
            : piece.piece === PieceType.King ? new SimpleKing1D(piece.position, piece.player)
                : piece.piece === PieceType.Knight ? new SimpleKnight1D(piece.position, piece.player)
                    : piece.piece === PieceType.Queen ? new SimpleQueen1D(piece.position, piece.player)
                        : piece.piece === PieceType.Rook ? new SimpleRook1D(piece.position, piece.player)
                            : /* piece.piece === Piece.Pawn ? */ new SimplePawn1D(piece.position, piece.player)
    };    // defines piece behaviour
}

// return the squares between rank_from and rank_to, exclusive, but only squares
// on the same 1D "diagonal", i.e. same colour
function squaresBetweenDiagonal(rank_from: number, rank_to: number) {
    const squares: Square[] = [];
    let min: number = Math.min(rank_from, rank_to);
    const max: number = Math.min(rank_from, rank_to);
    while ((min += 2) < max) {
        squares.push({ 'rank': min, 'file': 0 });
    }
    return squares;
}

class SimpleKnight1D extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return Math.abs(this.state.position.rank - location.rank) === 3
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Knight);
    }
}

class SimpleBishop1D extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (this.state.position.rank - location.rank) % 2 === 0
            && !blockedSquares(position, squaresBetweenDiagonal(this.state.position.rank, location.rank))
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Bishop);
    }
}

class SimpleQueen1D extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return ((this.state.position.rank - location.rank) % 2 === 0
            && !blockedSquares(position, squaresBetweenDiagonal(this.state.position.rank, location.rank)))
            || !blocked(boardToState(position), this.state.position, location)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Queen);
    }
}

