
import { DraftRules } from "./draftRules.js";

const draftRules1D: DraftRules = {
    startingPoints: 30,
    pieceLimit: 99,
    pieceCost: {
        Q: 10,
        R: 5,
        B: 4,
        N: 3,
        K: 99,
        P: 99
    },
    rounds: 3
};

export default draftRules1D;