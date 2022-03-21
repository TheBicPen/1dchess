
import board from "../positions/normal_chess";
import * as readline from 'readline';
import runAIGameNode from "./gameCLI";
import runDraftAIGameNode from "./draftCLI";

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Normal Game: 0\nDraft: 1\n", answer => {
    rl.close();
    if (answer === "0")
        runAIGameNode(board);
    else if (answer === "1")
        runDraftAIGameNode();
    else
        console.log("invalid choice");
});

