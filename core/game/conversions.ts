import { BoardState, GameBoard, Move, PieceType, Square } from "../models.js";


// moves should be encoded as the source square, <any char>, target square. null indicates invalid
// e.g. 'a2-e7', 'a4 a3', 'g9_g9'
export function parseMove(move: string): Move | null {
    if (move.length !== 5)
        return null;
    let sourceFile = letterToFile(move[0]);
    let sourceRank = parseInt(move[1]) - 1; // convert 1-index to 0-index
    let targetFile = letterToFile(move[3]);
    let targetRank = parseInt(move[4]) - 1; // convert 1-index to 0-index
    if (sourceFile === null || isNaN(sourceRank) || targetFile === null || isNaN(targetRank))
        return null;
    else
        return { 'from': { 'file': sourceFile, 'rank': sourceRank }, 'to': { 'file': targetFile, 'rank': targetRank } }
}

export function unparseSquare(square: Square): string | null {
    const fromFile = fileToLetter(square.file);
    return fromFile && fromFile + (square.rank + 1).toString();
}

export function unparse(move: Move): string | null {
    const fromSquare = unparseSquare(move.from);
    const toSquare = unparseSquare(move.to);
    return fromSquare && toSquare && `${fromSquare}-${toSquare}`;
}

// convert concrete game board to abstract board state
export function boardToState(board: GameBoard): BoardState {
    return { boardDimensions: board.boardDimensions, pieces: board.gamePieces.map(p => p.state) };
}

// TS doesn't have reverse mappings for string enums, so we use linear-time lookup
export function parsePiece(str: string): PieceType | undefined {
    return Object.values(PieceType).find(p => p === str.toUpperCase());
}


export function letterToFile(c: string): number | null {
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    let idx: number = letters.indexOf(c);
    return idx === -1 ? null : idx;
}

export function fileToLetter(n: number): string | null {
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    return n < letters.length ? letters[n] : null;
}
