import { AIPlayer } from "../ai/interface.js";
import randomAI from "../ai/random.js";
import { unparseSquare } from "../game/conversions.js";
import { BoardState, PiecePosition, Player } from "../models.js";
import { pieceAtLocation2, printBoard } from "../utils.js";
import { Draft } from "./draftModel.js";
import { DraftRules } from "./draftRules.js";



export function validateDraftChoice(rules: DraftRules, board: BoardState, player: Player, playerPoints: number, pick: PiecePosition): boolean {
    return playerPoints - rules.pieceCost[pick.piece] >= 0 &&
        !pieceAtLocation2(board, pick.position)
        /* && playerPick.player === Player.White */     // let the player add an opponent piece lol
        // TODO: restrict player placement: perhaps only adjacent to existing piece
        ;
}

// this is a draft controller. It's really only useful for CLI games - do not use this for event-driven uses
export async function runAIDraft(draftRules: DraftRules, board: BoardState, choosePiece: (rules: DraftRules, board: BoardState, player: Player, points: number) => Promise<PiecePosition>): Promise<BoardState> {
    const ai: AIPlayer = new randomAI(0);
    const draft = new Draft(board, draftRules, Player.White);

    for (let round = 0; round < draftRules.rounds; round++) {
        const playerPick = await choosePiece(draftRules, board, Player.White, draft.playerPoints.w);
        let picked = false;
        while (!picked) {
            picked = draft.choosePiece(Player.White, playerPick);
            if (!picked)
                console.error("invalid pick\n");
        }
        picked = false;
        while (!picked) {
            const pick = ai.draft(draftRules, board, Player.Black, draft.playerPoints.b);
            picked = draft.choosePiece(Player.Black, pick);
            if (picked)
                console.log(`AI picked ${pick.piece} at ${unparseSquare(pick.position)}`);
            else
                console.error("invalid AI pick\n");
        }
        printBoard(board);
    }
    return board;
}