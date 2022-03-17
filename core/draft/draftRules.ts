import { PieceType } from "../models";


export interface DraftRules {
    startingPoints: number,
    pieceLimit: number,
    pieceCost: { [p in PieceType]: number },
    rounds: number
};