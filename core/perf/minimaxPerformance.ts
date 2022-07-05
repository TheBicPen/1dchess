import { minimaxAI } from "../ai/minimax.js";
import { minimaxAlphaBetaAI } from "../ai/minimaxAB.js";
import MyopicMiniMax from "../ai/myopic_minimax.js";
import randomAI from "../ai/random.js";
import { BoardState, Player, Square } from "../models.js";
import X8_rooks_knight from "../positions/2x8_rooks_knight.js";
import { RuleSet } from "../rules/piece.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { printBoard } from "../utils/chessUtils.js";
import runAIVersus from "./AIVersusGame.js";
import generateBoard from "./generateBoard.js";


export function versus(runs: number) {
    const cpu1 = new minimaxAI(5);
    const cpu2 = new randomAI();
    let wins = 0, losses = 0;
    for (let index = 0; index < runs; index++) {
        const result = runAIVersus(X8_rooks_knight(), new SimpleRuleSet(), cpu1, cpu2);
        console.log(index, result);
        if (result[0].status === "loss")
            if (result[0].player === Player.White)
                losses++;
            else
                wins++;
    }
    console.log("wins: %s, losses: %s, winrate: %f", wins, losses, wins / runs);
}


export function boardValue(strength: number, runs: number, board: BoardState, rules: RuleSet, prune: boolean): [number, number, number] {
    const cpu1 = prune ? new minimaxAlphaBetaAI(strength) : new minimaxAI(strength);
    const cpu2 = new MyopicMiniMax(new randomAI(), 0.5);
    let wins = 0, losses = 0, max_turns = 0;
    for (let index = 0; index < runs; index++) {
        const result = runAIVersus(board, rules, cpu1, cpu2);
        console.log(index, result);
        if (result[0].status === "loss")
            if (result[0].player === Player.Black)
                wins++;
            else losses++;
        max_turns = Math.max(max_turns, result[1]);
    }
    return [wins, losses, max_turns];
}

export function testBoards(dim: Square, boards: number, runs: number, pieces: number, strength: number, rules: RuleSet, prune: boolean) {
    const board_wrs = [];
    for (let i = 0; i < boards; i++) {
        const board = generateBoard(dim, pieces, true);
        printBoard(board);
        const [wins, losses, max_moves] = boardValue(strength, runs, board, rules, prune);
        console.log("wins: %d, losses: %d, ties: %d, winrate: %f", wins, losses, runs - wins - losses, wins / runs);
        board_wrs.push([board, wins, losses, max_moves]);
    }
    return board_wrs;
}



testBoards({ 'file': 2, 'rank': 9 }, 100, 50, 3, 4, new SimpleRuleSet(), true).forEach(([board, wins, losses, max_turns]) => {
    printBoard(board as BoardState);
    console.log(wins, losses, max_turns);
});
