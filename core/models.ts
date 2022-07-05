
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
    file: number,
    rank: number
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