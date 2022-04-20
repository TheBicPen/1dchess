import { Square } from "../../models.js";


export function squareEq(s1: Square | null, s2: Square | null) {
    return s1 && s2
        && s1.file === s2.file
        && s1.rank === s2.rank;
}
