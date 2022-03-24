import { BoardState, PiecePosition, Player, Square } from "../models.js";
import board from "../positions/normal_empty.js";
import * as readline from "readline";
import { runAIDraft } from "../draft/draftController.js";
import draftRules1D from "../draft/1dDraftRules.js";
import { DraftRules } from "../draft/draftRules.js";
import { nextEmptySquare } from "../utils.js";
import runAIGameNode from "./gameCLI.js";
import { parsePiece } from "./conversions.js";

export default async function runDraftAIGameNode() {
    try {
        const theBoard = await runAIDraft(draftRules1D, board, requestDraft);
        console.log("Let's play!");
        runAIGameNode(theBoard);
    } catch (error) {
        console.error(error);
    }
}

async function requestDraft(rules: DraftRules, board: BoardState, player: Player, points: number): Promise<PiecePosition> {
    const rl = readline.createInterface({
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
                const piece = parsePiece(answer);
                if (piece) resolve({ 'piece': piece, 'player': player, 'position': nextEmptySquare(board, player) as Square });
                else reject(piece);
            });
        }
    );
}
