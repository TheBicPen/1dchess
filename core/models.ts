import { GamePiece, RuleSet } from "./rules/piece.js";

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
    file: number
    rank: number,
}

export interface PiecePosition {
    piece: PieceType,
    position: Square,
    player: Player
}

// abstract, unaware of rules
export interface BoardState {
    boardDimensions: Square,
    pieces: PiecePosition[],
}

// concrete, aware of rules and piece movement
export interface GameBoard {
    boardDimensions: Square,
    gamePieces: GamePiece[],
    rules: RuleSet
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