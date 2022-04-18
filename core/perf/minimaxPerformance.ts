import { minimaxAI } from "../ai/minimax";
import randomAI from "../ai/random";
import { Player } from "../models";
import X8_rooks_knight from "../positions/2x8_rooks_knight";
import { SimpleRuleSet } from "../rules/simplePieces";
import runAIVersus from "./AIVersusGame";







export default function run(runs: number) {
    const cpu1 = new minimaxAI(5);
    const cpu2 = new randomAI(3);
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
    console.log("wins: %s, losses: %s, winrate: %f", wins, losses, wins/runs);
}


run(100);
