import { BoardState, PieceType, Player } from "../models.js";
import { deepClone } from "../utils.js";


const board: BoardState = {
    "pieces": [
        { 'piece': PieceType.King, 'player': Player.White, 'position': { 'rank': 0, 'file': 0 } },
        { 'piece': PieceType.Rook, 'player': Player.White, 'position': { 'rank': 0, 'file': 1 } },
        { 'piece': PieceType.Knight, 'player': Player.White, 'position': { 'rank': 1, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 1 } },

        { 'piece': PieceType.King, 'player': Player.Black, 'position': { 'rank': 7, 'file': 0 } },
        { 'piece': PieceType.Rook, 'player': Player.Black, 'position': { 'rank': 7, 'file': 1 } },
        { 'piece': PieceType.Knight, 'player': Player.Black, 'position': { 'rank': 6, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 1 } },
    ], "boardDimensions": { "rank": 8, "file": 2 },
};
export default () => deepClone(board);