import { PiecePosition, Location, GameBoard, Move, Player, Piece } from "../models";
import { blocked, pieceAtLocation } from "../utils";
import { SimplePiece } from "./piece";


export class SimpleKing extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        let dist: Number = Math.abs(this.state.position.file - location.file) + Math.abs(this.state.position.rank - location.rank);
        return dist === 1
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, Piece.King);
    }
}

export class SimpleKnight extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        return (Math.abs(this.state.position.file - location.file) === 2 && Math.abs(this.state.position.rank - location.rank) === 1
            || Math.abs(this.state.position.file - location.file) === 1 && Math.abs(this.state.position.rank - location.rank) === 2)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, Piece.Knight);
    }
}

export class SimpleBishop extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        return Math.abs(this.state.position.file - this.state.position.rank) === Math.abs(location.file - location.rank)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && !blocked(position, this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, Piece.Queen);
    }
}

export class SimpleQueen extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        return (Math.abs(this.state.position.file - this.state.position.rank) === Math.abs(location.file - location.rank)
            || this.state.position.file === location.file || this.state.position.rank === location.rank)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && !blocked(position, this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, Piece.Queen);
    }
}

export class SimpleRook extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        return (this.state.position.file === location.file || this.state.position.rank === location.rank)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && !blocked(position, this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Location, player: Player) {
        super(location, player, Piece.Rook);
    }
}

export class SimplePawn extends SimplePiece {
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean {
        let rankMult: -1 | 1 = this.state.player === Player.White ? 1 : -1;
        let thisPosition: Location = this.state.position;
        let plus2 = ((thisPosition.rank === 2 || thisPosition.rank === position.boardDimensions.rank - 2)
            && location.rank === thisPosition.rank + 2 * rankMult && !blocked(position, this.state.position, location))  // initial +2 move
        let forwardMove: boolean = (plus2 || location.rank === thisPosition.rank + rankMult)
            && thisPosition.file === location.file && !pieceAtLocation(position, location) // non-capture forward move
        return forwardMove
            || (pieceAtLocation(position, location)?.state.player === (this.state.player === Player.White ? Player.Black : Player.White)
                && Math.abs(thisPosition.file - location.file) === 1)
            && true; //ignore considerCheck for now
            // no en passant yet
    }
    constructor(location: Location, player: Player) {
        super(location, player, Piece.Pawn);
    }
}