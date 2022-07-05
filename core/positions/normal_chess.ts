import { BoardState, PieceType, Player } from "../models.js";
import { deepClone } from "../utils/chessUtils.js";


const board: BoardState = {
    "pieces": [
        { 'piece': PieceType.Rook, 'player': Player.White, 'position': { 'rank': 0, 'file': 0 } },
        { 'piece': PieceType.Knight, 'player': Player.White, 'position': { 'rank': 0, 'file': 1 } },
        { 'piece': PieceType.Bishop, 'player': Player.White, 'position': { 'rank': 0, 'file': 2 } },
        { 'piece': PieceType.Queen, 'player': Player.White, 'position': { 'rank': 0, 'file': 3 } },
        { 'piece': PieceType.King, 'player': Player.White, 'position': { 'rank': 0, 'file': 4 } },
        { 'piece': PieceType.Bishop, 'player': Player.White, 'position': { 'rank': 0, 'file': 5 } },
        { 'piece': PieceType.Knight, 'player': Player.White, 'position': { 'rank': 0, 'file': 6 } },
        { 'piece': PieceType.Rook, 'player': Player.White, 'position': { 'rank': 0, 'file': 7 } },

        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 1 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 2 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 3 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 4 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 5 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 6 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 7 } },


        { 'piece': PieceType.Rook, 'player': Player.Black, 'position': { 'rank': 7, 'file': 0 } },
        { 'piece': PieceType.Knight, 'player': Player.Black, 'position': { 'rank': 7, 'file': 1 } },
        { 'piece': PieceType.Bishop, 'player': Player.Black, 'position': { 'rank': 7, 'file': 2 } },
        { 'piece': PieceType.Queen, 'player': Player.Black, 'position': { 'rank': 7, 'file': 3 } },
        { 'piece': PieceType.King, 'player': Player.Black, 'position': { 'rank': 7, 'file': 4 } },
        { 'piece': PieceType.Bishop, 'player': Player.Black, 'position': { 'rank': 7, 'file': 5 } },
        { 'piece': PieceType.Knight, 'player': Player.Black, 'position': { 'rank': 7, 'file': 6 } },
        { 'piece': PieceType.Rook, 'player': Player.Black, 'position': { 'rank': 7, 'file': 7 } },

        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 1 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 2 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 3 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 4 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 5 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 6 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 6, 'file': 7 } }
    ], "boardDimensions": { "rank": 8, "file": 8 },
};
export default () => deepClone(board);