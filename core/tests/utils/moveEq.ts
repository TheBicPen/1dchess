import { Move } from "../../models.js";
import { squareEq } from "./squareEq.js";

export function moveEq(m1: Move | null, m2: Move | null) {
    return m1 && m2
        && m1.from && m1.to
        && m2.from && m2.to
        && squareEq(m1.from, m2.from)
        && squareEq(m1.to, m2.to);
}
