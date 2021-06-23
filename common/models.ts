

interface boardPosition {
    ranks: Number,
    files: Number,
    whitePlayer: playerPosition,
    blackPlayer: playerPosition
}

interface playerPosition {
    pieces: piece[],
    canCastle: boolean
}

interface piece {
    colour: colour,
    type: pieceType,
    rank: Number,
    file: Number
}


enum pieceType {
    Queen = "Q",
    King = "K",
    Rook = "R",
    Bishop = "B",
    Knight = "N"
}

enum colour {
    black = "B",
    white = "W"
}