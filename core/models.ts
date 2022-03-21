import { GamePiece } from "./rules/piece.js";

// matches front-end library
export enum PieceType {
    Queen = "Q",
    King = "K",
    Rook = "R",
    Bishop = "B",
    Knight = "N",
    Pawn = "P"
}

export interface Square {
    rank: number,
    file: number
}

export interface PiecePosition {
    piece: PieceType,
    position: Square,
    player: Player
}

// abstract, unaware of rules
export interface BoardState {
    pieces: PiecePosition[],
    boardDimensions: Square,
}

// concrete, aware of rules and piece movement
export interface GameBoard {
    gamePieces: GamePiece[],
    boardDimensions: Square,
    rules: Rules
}

// global rules for a game
export interface Rules {
    kingCheck: boolean
}

// matches front-end library
export enum Player {
    Black = "b",
    White = "w"
}

export interface Move {
    from: Square,
    to: Square
}