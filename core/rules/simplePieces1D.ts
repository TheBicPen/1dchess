import { PiecePosition, Location, GameBoard, Move, Player, PieceType, Rules } from "../models";
import { blocked, blockedSquares, enumeratePositions, pieceAtLocation } from "../utils";
import { GamePiece, RuleSet } from "./piece";
import { SimplePiece, SimpleRuleSet } from "./simplePieces";



export { SimpleKing } from "./simplePieces";
export { SimpleRook } from "./simplePieces";
export { SimplePawn } from "./simplePieces";

function piecesBetweenDiagonal(rank_from: number, rank_to: number) {
    let squares: Location[] = [];
    let min: number = Math.min(rank_from, rank_to);
    let max: number = Math.min(rank_from, rank_to);
    while ((min += 2) < max) {
        squares.push({ 'rank': min, 'file': 0 });
    }
    return squares;
}

export class SimpleKnight extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        return Math.abs(this.state.position.rank - location.rank) === 3
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, PieceType.Knight);
    }
}

export class SimpleBishop extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        return (this.state.position.rank - location.rank) % 2 === 0
            && !blockedSquares(position, piecesBetweenDiagonal(this.state.position.rank, location.rank))
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, PieceType.Bishop);
    }
}

export class SimpleQueen extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        return ((this.state.position.rank - location.rank) % 2 === 0
            && !blockedSquares(position, piecesBetweenDiagonal(this.state.position.rank, location.rank)))
            || !blocked(position, this.state.position, location)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, PieceType.Queen);
    }
}

