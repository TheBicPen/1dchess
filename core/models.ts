import { GamePiece } from "./rules/piece";


export enum PieceType {
    Queen,
    King,
    Rook,
    Bishop,
    Knight,
    Pawn
};

export interface Location {
    rank: number,
    file: number
};

export interface PiecePosition {
    piece: PieceType,
    position: Location,
    player: Player
};

// abstract, unaware of rules
export interface boardState {
    pieces: PiecePosition[],
    boardDimensions: Location,
};

// concrete, aware of rules and contains movement
export interface GameBoard {
    gamePieces: GamePiece[],
    boardDimensions: Location,
    rules: Rules
};

// global rules for a game
export interface Rules {
    kingCheck: boolean
};


export enum Player {
    Black,
    White
};

export interface Move {
    from: Location,
    to: Location
};