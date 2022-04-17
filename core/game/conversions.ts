import { BoardState, Move, PieceType, Square } from "../models.js";
import { GameBoard } from "./GameBoard";


// moves should be encoded as the source square, <any char>, target square. null indicates invalid
// e.g. 'a2-e7', 'a4 a3', 'g9_g9'
export function parseMove(move: string): Move | null {
    if (move.length !== 5)
        return null;
    const from = parseSquare(move.slice(0, 2));
    const to = parseSquare(move.slice(3, 5));
    return from && to && { 'from': from, 'to': to };
}

export function parseSquare(square: string): Square | null {
    if (square.length !== 2)
        return null;
    const file = letterToFile(square[0]);
    const rank = parseInt(square[1]) - 1; // convert 1-index to 0-index
    if (file === null || isNaN(rank))
        return null;
    else
        return { 'file': file, 'rank': rank };
}

export function unparseSquare(square: Square): string | null {
    const fromFile = fileToLetter(square.file);
    return fromFile && fromFile + (square.rank + 1).toString();
}

export function unparseMove(move: Move): string | null {
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
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const idx: number = letters.indexOf(c.toLowerCase());
    return idx === -1 ? null : idx;
}

export function fileToLetter(n: number): string | null {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return n < letters.length ? letters[n] : null;
}
