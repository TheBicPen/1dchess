import { fileToLetter, parsePiece } from "../core/game/conversions.js";
import { BoardState, PieceType, Player } from "../core/models.js";



export function objToBoardObj(position: BoardState): object {
    const out: any = {};
    position.pieces.forEach(p => {
        const file: string | null = fileToLetter(p.position.file);
        if (file)
            out[file + (p.position.rank + 1).toString()] = p.player + p.piece;
    });
    return out;
}


export function parseObjPiece(p: string): { piece: PieceType, player: Player } | undefined {
    if (p.length !== 2)
        return undefined;
    const player = p[0] === "w" ? Player.White : Player.Black;
    const piece = parsePiece(p[1]);
    return player && piece && { 'piece': piece, 'player': player };
}

export function unparseObjPiece(piece: PieceType, player: Player ): string {
  return `${player}${piece}`;   // this makes sure both are strings
}