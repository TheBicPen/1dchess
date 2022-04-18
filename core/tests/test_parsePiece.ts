import { parsePiece } from "../game/conversions.js";
import { PieceType } from "../models.js";


export default () => {
    console.log("Testing piece parsing.");

    let val: PieceType | undefined;

    val = parsePiece("K");
    console.assert(val === PieceType.King);

    val = parsePiece("k");
    console.assert(val === PieceType.King);

    val = parsePiece("Q");
    console.assert(val === PieceType.Queen);

    val = parsePiece("R");
    console.assert(val === PieceType.Rook);

    val = parsePiece("N");
    console.assert(val === PieceType.Knight);

    val = parsePiece("P");
    console.assert(val === PieceType.Pawn);

    val = parsePiece("V");
    console.assert(val === undefined);

    val = parsePiece("");
    console.assert(val === undefined);

    val = parsePiece("1");
    console.assert(val === undefined);

    val = parsePiece("QQ");
    console.assert(val === undefined);
}