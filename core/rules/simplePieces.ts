import { PiecePosition, Square, GameBoard, Move, Player, PieceType, Rules } from "../models.js";
import { blocked, boardState, enumeratePositions, pieceAtLocation } from "../utils.js";
import { GamePiece, RuleSet } from "./piece.js";


export class SimpleRuleSet extends RuleSet {
    rules: Rules = { 'kingCheck': false };
    pieceToGamePiece = pieceToGamePiece;    // defines piece behaviour
}

export abstract class SimplePiece implements GamePiece {
    state: PiecePosition;
    moveTo(location: Square): void {
        this.state.position = location;
    };
    abstract legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean;

    getLegalMoves(considerCheck: boolean, position: GameBoard): Square[] {
        return enumeratePositions(position.boardDimensions).filter(x => this.legalMove(x, considerCheck, position));
    };
    locationToMove(to: Square): Move {
        return { "from": this.state.position, "to": to };
    };
    constructor(location: Square, player: Player, piece: PieceType) {
        this.state = { 'position': location, 'player': player, 'piece': piece };
    };
}

export function pieceToGamePiece(piece: PiecePosition): GamePiece {
    return piece.piece === PieceType.Bishop ? new SimpleBishop(piece.position, piece.player)
        : piece.piece === PieceType.King ? new SimpleKing(piece.position, piece.player)
            : piece.piece === PieceType.Knight ? new SimpleKnight(piece.position, piece.player)
                : piece.piece === PieceType.Queen ? new SimpleQueen(piece.position, piece.player)
                    : piece.piece === PieceType.Rook ? new SimpleRook(piece.position, piece.player)
                        : /* piece.piece === Piece.Pawn ? */ new SimplePawn(piece.position, piece.player);
}

export class SimpleKing extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        let dist: number = Math.abs(this.state.position.file - location.file) + Math.abs(this.state.position.rank - location.rank);
        return dist === 1
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.King);
    }
}

export class SimpleKnight extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (Math.abs(this.state.position.file - location.file) === 2 && Math.abs(this.state.position.rank - location.rank) === 1
            || Math.abs(this.state.position.file - location.file) === 1 && Math.abs(this.state.position.rank - location.rank) === 2)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Knight);
    }
}

export class SimpleBishop extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return Math.abs(this.state.position.file - this.state.position.rank) === Math.abs(location.file - location.rank)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && !blocked(boardState(position), this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Bishop);
    }
}

export class SimpleQueen extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (Math.abs(this.state.position.file - this.state.position.rank) === Math.abs(location.file - location.rank)
            || this.state.position.file === location.file || this.state.position.rank === location.rank)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && !blocked(boardState(position), this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Queen);
    }
}

export class SimpleRook extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (this.state.position.file === location.file || this.state.position.rank === location.rank)
            && pieceAtLocation(position, location)?.state.player !== this.state.player //piece is other player's or empty
            && !blocked(boardState(position), this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Rook);
    }
}

export class SimplePawn extends SimplePiece {
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        let rankMult: -1 | 1 = this.state.player === Player.White ? 1 : -1;
        let thisPosition: Square = this.state.position;
        let plus2 = ((thisPosition.rank === 1 || thisPosition.rank === position.boardDimensions.rank - 2)
            && location.rank === thisPosition.rank + 2 * rankMult && !blocked(boardState(position), this.state.position, location))  // initial +2 move
        let forwardMove: boolean = (plus2 || location.rank === thisPosition.rank + rankMult)
            && thisPosition.file === location.file && !pieceAtLocation(position, location) // non-capture forward move
        return forwardMove
            || (pieceAtLocation(position, location)?.state.player === (this.state.player === Player.White ? Player.Black : Player.White)
                && Math.abs(thisPosition.file - location.file) === 1)
            && true; //ignore considerCheck for now
        // no en passant yet
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Pawn);
    }
}