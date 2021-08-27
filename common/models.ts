

export interface boardPosition {
    ranks: number,
    files: number,
    nextMove: colour,
    whitePlayer: playerState,
    blackPlayer: playerState,
    halfMoveClock: number,
    fullMoveNumber: number,
    enPassantTarget: square
    pieces: piece[],
}

export interface playerState {
    castlePossibilities: square[]
}


export interface piece {
    colour: colour,
    type: pieceType,
    position: square
}

export interface square {
    rank: number,
    file: number
}

export enum pieceType {
    Queen = "Q",
    King = "K",
    Rook = "R",
    Bishop = "B",
    Knight = "N"
}

export enum colour {
    black = "B",
    white = "W"
}