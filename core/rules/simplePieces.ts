import { boardToState } from "../game/conversions.js";
import { Game, nextPlayer } from "../game/gameModel.js";
import { PiecePosition, Square, Move, Player, PieceType, Rules, BoardState } from "../models.js";
import { GameBoard } from "../game/GameBoard.js";
import { blocked, enumeratePositions, pieceAtLocation } from "../utils.js";
import { GamePiece, RuleSet } from "./piece.js";


export class SimpleRuleSet implements RuleSet {
    rules: Rules = { 'kingCheck': false };
    pieceToGamePiece = pieceToGamePiece;    // defines piece behaviour
}

export abstract class SimplePiece implements GamePiece {
    state: PiecePosition;
    moveTo(location: Square): void {
        this.state.position = location;
    }
    abstract legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean;
    potentialMoves(position: GameBoard): Square[] {
        return enumeratePositions(position.boardDimensions);
    }

    getLegalMoves(considerCheck: boolean, position: GameBoard): Square[] {
        return this.potentialMoves(position).filter(x => this.legalMove(x, considerCheck, position));
    }
    locationToMove(to: Square): Move {
        return { "from": this.state.position, "to": to };
    }
    constructor(location: Square, player: Player, piece: PieceType) {
        this.state = { 'position': location, 'player': player, 'piece': piece };
    }
}

// return whether the target square is empty or has the other player's piece
function emptyOrOpponent(position: GameBoard, location: Square, current_player: Player) {
    return pieceAtLocation(position, location)?.state.player !== current_player;
}

function onBoard(s: Square, boardDims: Square) {
    return s.file >= 0 && s.file < boardDims.file && s.rank >= 0 && s.rank < boardDims.rank;
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
    override potentialMoves(position: GameBoard): Square[] {
        const pos = this.state.position;
        const out = [
            { 'file': pos.file - 1, 'rank': pos.rank - 1 },
            { 'file': pos.file - 1, 'rank': pos.rank },
            { 'file': pos.file - 1, 'rank': pos.rank + 1 },
            { 'file': pos.file, 'rank': pos.rank - 1 },
            { 'file': pos.file, 'rank': pos.rank + 1 },
            { 'file': pos.file + 1, 'rank': pos.rank - 1 },
            { 'file': pos.file + 1, 'rank': pos.rank },
            { 'file': pos.file + 1, 'rank': pos.rank + 1 }
        ];
        return out.filter(s => onBoard(s, position.boardDimensions));
    }

    override legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return Math.abs(this.state.position.file - location.file) <= 1
            && Math.abs(this.state.position.rank - location.rank) <= 1
            && emptyOrOpponent(position, location, this.state.player)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.King);
    }
}

export class SimpleKnight extends SimplePiece {
    override potentialMoves(position: GameBoard): Square[] {
        const pos = this.state.position;
        const out = [
            { 'file': pos.file - 2, 'rank': pos.rank - 1 },
            { 'file': pos.file - 2, 'rank': pos.rank + 1 },
            { 'file': pos.file - 1, 'rank': pos.rank - 2 },
            { 'file': pos.file - 1, 'rank': pos.rank + 2 },
            { 'file': pos.file + 1, 'rank': pos.rank - 2 },
            { 'file': pos.file + 1, 'rank': pos.rank + 2 },
            { 'file': pos.file + 2, 'rank': pos.rank - 1 },
            { 'file': pos.file + 2, 'rank': pos.rank + 1 },
        ];
        return out.filter(s => onBoard(s, position.boardDimensions));
    }
    override legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (Math.abs(this.state.position.file - location.file) === 2 && Math.abs(this.state.position.rank - location.rank) === 1
            || Math.abs(this.state.position.file - location.file) === 1 && Math.abs(this.state.position.rank - location.rank) === 2)
            && emptyOrOpponent(position, location, this.state.player)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Knight);
    }
}

export class SimpleBishop extends SimplePiece {
    override legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (this.state.position.file - this.state.position.rank === location.file - location.rank
            || this.state.position.file + this.state.position.rank === location.file + location.rank)
            && emptyOrOpponent(position, location, this.state.player)
            && !blocked(boardToState(position), this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Bishop);
    }
}

export class SimpleQueen extends SimplePiece {
    override legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (this.state.position.file - this.state.position.rank === location.file - location.rank
            || this.state.position.file + this.state.position.rank === location.file + location.rank
            || this.state.position.file === location.file || this.state.position.rank === location.rank)
            && emptyOrOpponent(position, location, this.state.player)
            && !blocked(boardToState(position), this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Queen);
    }
}

export class SimpleRook extends SimplePiece {
    override legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        return (this.state.position.file === location.file || this.state.position.rank === location.rank)
            && emptyOrOpponent(position, location, this.state.player)
            && !blocked(boardToState(position), this.state.position, location)
            && true; //ignore considerCheck for now
    }
    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Rook);
    }
}

export class SimplePawn extends SimplePiece {
    override potentialMoves(position: GameBoard): Square[] {
        const rankMult: -1 | 1 = this.state.player === Player.White ? 1 : -1;
        const pos = this.state.position;
        const out = [
            { 'file': pos.file, 'rank': pos.rank + rankMult },
            { 'file': pos.file, 'rank': pos.rank + rankMult * 2 },
            { 'file': pos.file - 1, 'rank': pos.rank + rankMult },
            { 'file': pos.file + 1, 'rank': pos.rank + rankMult },
        ];
        return out.filter(s => onBoard(s, position.boardDimensions));
    }

    override legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean {
        const rankMult: -1 | 1 = this.state.player === Player.White ? 1 : -1;
        const twoMoveRank = this.state.player === Player.White ? 1 : position.boardDimensions.rank - 2;
        const curPos: Square = this.state.position;
        const fileDiff = Math.abs(curPos.file - location.file);

        // initial +2 move
        const forward2 = fileDiff === 0
            && curPos.rank === twoMoveRank
            && location.rank === curPos.rank + 2 * rankMult
            && !blocked(boardToState(position), this.state.position, location)
            && !pieceAtLocation(position, location);

        // non-capture forward move
        const forward1 = fileDiff === 0
            && location.rank === curPos.rank + rankMult
            && curPos.file === location.file
            && !pieceAtLocation(position, location);

        // capture diagonally (not via en passant)
        const diagCapture = fileDiff === 1
            && location.rank === curPos.rank + rankMult
            && pieceAtLocation(position, location)?.state.player === nextPlayer(this.state.player);

        // no en passant yet
        // ignore considerCheck for now
        return forward1 || forward2 || diagCapture;
    }


    constructor(location: Square, player: Player) {
        super(location, player, PieceType.Pawn);
    }
}