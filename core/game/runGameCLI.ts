
import board from "../positions/normal_chess.js";
import board_1d from "../positions/2x8_rooks_knight.js";
import * as readline from "readline";
import runAIGameNode from "./gameCLI.js";
import runDraftAIGameNode from "./draftCLI.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { SimpleRuleSet1D } from "../rules/simplePieces1D.js";
import empty from "../positions/empty.js";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Normal Game: 0\nDraft: 1\n1D game: 2\n1D Draft Game: 3\n", answer => {
    rl.close();
    if (answer === "0")
        runAIGameNode(board(), new SimpleRuleSet());
    else if (answer === "1")
        runDraftAIGameNode(empty({ 'file': 8, 'rank': 8 }), new SimpleRuleSet());
    else if (answer === "2")
        runAIGameNode(board_1d(), new SimpleRuleSet());
    else if (answer === "3")
        runDraftAIGameNode(empty({ 'file': 1, 'rank': 8 }), new SimpleRuleSet1D());
    else
        console.log("invalid choice");
});

