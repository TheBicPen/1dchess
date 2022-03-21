import { fileToLetter } from "../core/game/conversions.js";
import { BoardState } from "../core/models.js";



export function objToBoardObj(position: BoardState): object {
    const out: any = {};
    position.pieces.forEach(p => {
        const file: string | null = fileToLetter(p.position.file);
        if (file)
            out[file + (p.position.rank + 1).toString()] = p.player + p.piece;
    });
    return out;
}
