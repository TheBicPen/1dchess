import { boardState, PieceType, Player } from "../models";


const board: boardState = {
    "pieces": [
        { 'piece': PieceType.King, 'player': Player.White, 'position': { 'rank': 0, 'file': 0 } },
        { 'piece': PieceType.Rook, 'player': Player.White, 'position': { 'rank': 1, 'file': 0 } },
        { 'piece': PieceType.Knight, 'player': Player.White, 'position': { 'rank': 2, 'file': 0 } },

        { 'piece': PieceType.King, 'player': Player.Black, 'position': { 'rank': 7, 'file': 0 } },
        { 'piece': PieceType.Knight, 'player': Player.Black, 'position': { 'rank': 6, 'file': 0 } },
        { 'piece': PieceType.Rook, 'player': Player.Black, 'position': { 'rank': 5, 'file': 0 } }
    ], "boardDimensions": { "rank": 8, "file": 1 },
};
export default board;