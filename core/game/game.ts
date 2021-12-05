import { AIPlayer } from "../ai/interface";
import randomAI from "../ai/random";
import { boardState, Move } from "../models";
import { requestMove } from "./makeMove";


export async function runAIGame() {
    let CPU: AIPlayer = new randomAI(0);
    let board: boardState = { "pieces": [], "boardDimensions": { "rank": 8, "file": 1 } };

    let move: Move | null = null;
    while (!move) {
        try {
            move = await requestMove();
        } catch (error) {
            console.error("error:", error);
        } 
    }
}

runAIGame();