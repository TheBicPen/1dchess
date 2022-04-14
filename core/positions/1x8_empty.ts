import { BoardState } from "../models.js";
import { deepClone } from "../utils.js";


const board: BoardState = {
    "pieces": [], "boardDimensions": { "rank": 8, "file": 1 },
};
export default () => deepClone(board);