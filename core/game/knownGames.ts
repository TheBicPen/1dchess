import { Game } from "./gameModel.js";
import starting_position from "../positions/normal_chess.js";
import one9 from "../positions/1x9_rook_knight.js";
import two8 from "../positions/2x8_rooks_knight.js";
import empty_position from "../positions/empty.js";
import draftRules1D from "../draft/1dDraftRules.js";
import { Draft } from "../draft/draftModel.js";
import { Player } from "../models.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { SimpleRuleSet1D } from "../rules/simplePieces1D.js";


// names of known board setups
const positions = {
    "1x9": one9,
    "2x8": two8,
    "8x8": starting_position
};

export const positionNames = Object.keys(positions);
export type namedPositions = keyof typeof positions;


// Factory for cases where we do not need full control over the game setup
export function knownGame(name: namedPositions): Game {
    const board = positions[name]();
    const rules = board.boardDimensions.file <= 2 ? new SimpleRuleSet1D() : new SimpleRuleSet();
    return new Game(board, rules);
}


// Factory for cases where we do not need full control over the draft setup
export function knownDraft(name: namedPositions, player: Player = Player.White): Draft {
    const board = empty_position(positions[name]().boardDimensions);
    const rules = board.boardDimensions.file <= 2 ? draftRules1D : draftRules1D; // placeholder
    return new Draft(board, rules, player);
}


