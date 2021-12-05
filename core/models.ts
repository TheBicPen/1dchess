import { GamePiece } from "./rules/piece";


export enum Piece {
    Queen,
    King,
    Rook,
    Bishop,
    Knight,
    Pawn
}

export interface Location {
    rank: number,
    file: number
}
export interface PiecePosition {
    piece: Piece,
    position: Location,
    player: Player
}

export interface boardState {
    pieces: PiecePosition[],
    boardDimensions: Location,
}

export interface GameBoard {
    gamePieces: GamePiece[],
    boardDimensions: Location,
    rules: Rules
}

export interface Rules {
    kingCheck: boolean
}

export enum Player {
    Black,
    White
}

export interface Move {
    from: Location,
    to: Location
}