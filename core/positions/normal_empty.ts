import { BoardState } from "../models.js";
import { deepClone } from "../utils.js";



const board: BoardState = { 'boardDimensions': { 'rank': 8, 'file': 8 }, 'pieces': [] };
export default () => deepClone(board);