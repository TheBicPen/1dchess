import { BoardState, PiecePosition, Player, Square } from "../models";
import board from "../positions/normal_empty";
import * as readline from 'readline';
import { runAIDraft } from "../draft/draft";
import draftRules1D from "../draft/1dDraftRules";
import { DraftRules } from "../draft/draftRules";
import { nextEmptySquare, parsePiece } from "../utils";
import runAIGameNode from "./gameCLI";

export default async function runDraftAIGameNode() {
    try {
        const theBoard = await runAIDraft(draftRules1D, board, requestDraft);
        runAIGameNode(theBoard);
    } catch (error) {
        console.error(error);
    }
}

async function requestDraft(rules: DraftRules, board: BoardState, player: Player, points: number): Promise<PiecePosition> {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log(`Rules: draft ${rules.rounds} rounds`);
    for (const [p, cost] of Object.entries(rules.pieceCost))
        console.log(`Piece ${p} costs ${cost}`);

    return new Promise<PiecePosition>(
        (resolve, reject) => {
            rl.question(`Choose a piece. You have ${points} points left.\n`, answer => {
                rl.close();
                let piece = parsePiece(answer);
                if (piece) resolve({ 'piece': piece, 'player': player, 'position': nextEmptySquare(board, player) as Square });
                else reject(piece);
            });
        }
    );
}
