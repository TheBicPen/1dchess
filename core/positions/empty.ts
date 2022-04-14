import { BoardState, Square } from "../models.js";

export default (dim: Square): BoardState => { return { 'pieces': [], 'boardDimensions': dim } };    // explicit return since we return an object literal
