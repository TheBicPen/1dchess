import { BoardState, PieceType, Player } from "../models";



const board: BoardState = {
    'boardDimensions': { 'rank': 4, 'file': 4 }, 'pieces': [
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 0, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 0, 'file': 1 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 0, 'file': 2 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 0, 'file': 3 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 1 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 2 } },
        { 'piece': PieceType.Pawn, 'player': Player.White, 'position': { 'rank': 1, 'file': 3 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 2, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 2, 'file': 1 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 2, 'file': 2 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 2, 'file': 3 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 3, 'file': 0 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 3, 'file': 1 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 3, 'file': 2 } },
        { 'piece': PieceType.Pawn, 'player': Player.Black, 'position': { 'rank': 3, 'file': 3 } },
    ]
};
export default board;