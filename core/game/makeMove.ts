import { Move, Square } from "../models.js";
import { fileToLetter, letterToFile } from "../utils.js";


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
    return fromFile && fromFile + (square.rank+1).toString();
}

export function unparse(move: Move): string | null {
    const fromSquare = unparseSquare(move.from);
    const toSquare = unparseSquare(move.to);
    return fromSquare && toSquare && `${fromSquare}-${toSquare}`;
}
