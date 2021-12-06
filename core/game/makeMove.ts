import { Move } from "../models";
import { letterToFile } from "../utils";
import * as readline from 'readline';

// moves should be encoded as the source square, space, target square. null indicates invalid
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

export async function requestMove(): Promise<Move> {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise<Move>(
        (resolve, reject) => {
            rl.question("Enter a move\n", answer => {
                rl.close();
                let move: Move | null = parseMove(answer);
                if (move) resolve(move);
                else reject(move);
            });
        }
    );
}