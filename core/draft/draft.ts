import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { BoardState, PiecePosition, PieceType, Player, Square } from "../models";
import { RuleSet } from "../rules/piece";
import { blocked, countPieces, nextEmptySquare, pieceAtLocation, pieceAtLocation2 } from "../utils";
import { DraftRules } from "./draftRules";



function validateDraftChoice(rules: DraftRules, board: BoardState, player: Player, playerPoints: number, pick: PiecePosition): boolean {
    return playerPoints - rules.pieceCost[pick.piece] >= 0 &&
        !pieceAtLocation2(board, pick.position)
        /* && playerPick.player === Player.White */     // let the player add an opponent piece lol
        // TODO: restrict player placement: perhaps only adjacent to existing piece
        ;
}


export async function runAIDraft(draftRules: DraftRules, board: BoardState, choosePiece: (rules: DraftRules, board: BoardState, player: Player, points: number) => Promise<PiecePosition>): Promise<BoardState> {
    let AIPoints: number = draftRules.startingPoints;
    let playerPoints: number = draftRules.startingPoints;
    let ai: AIPlayer = new randomAI(0);
    board.pieces.push({ 'position': nextEmptySquare(board, Player.White) as Square, 'player': Player.White, 'piece': PieceType.King });
    board.pieces.push({ 'position': nextEmptySquare(board, Player.Black) as Square, 'player': Player.Black, 'piece': PieceType.King });

    for (let round = 0; round < draftRules.rounds; round++) {
        const playerPick = await choosePiece(draftRules, board, Player.White, playerPoints);
        if (validateDraftChoice(draftRules, board, Player.White, playerPoints, playerPick)) {
            board.pieces.push(playerPick);
            playerPoints -= draftRules.pieceCost[playerPick.piece];
        }
        else {
            console.error("invalid pick\n");
        }
        const AIPick = ai.draft(draftRules, board, Player.Black, AIPoints);
        if (validateDraftChoice(draftRules, board, Player.Black, AIPoints, AIPick)) {
            board.pieces.push(AIPick);
            AIPoints -= draftRules.pieceCost[AIPick.piece];
        }
        else {
            console.error("invalid AI pick\n");
        }
    }
    return board;
}