


import chessboard from '../lib/chessboard.js'
import { moveResult, moveStatus, runAIGame, status } from '../core/game/game.js'
import { unparse } from '../core/game/makeMove.js';
import starting_position from '../core/positions/1d_standard.js';
import { BoardState, Move } from '../core/models.js';
import { fileToLetter } from '../core/utils.js';
import { AIPlayer } from '../core/ai/interface.js';
import randomAI from '../core/ai/random.js';
import { RuleSet } from '../core/rules/piece.js';
import { SimpleRuleSet1D } from '../core/rules/simplePieces1D.js';

type action = "snapback" | "trash" | "drop";

let files: number = 1;
let ranks: number = 8;
let CPU: AIPlayer = new randomAI(0);
let ruleSet: RuleSet = new SimpleRuleSet1D();

let game: any = runAIGame(ruleSet, CPU, starting_position);

function objToBoardObj(position: BoardState): object {
    let out: any = {};
    position.pieces.forEach(p => {
        let file: string | null = fileToLetter(p.position.file);
        if (file)
            out[file + (p.position.rank + 1).toString()] = p.player + p.piece;
    });
    return out;
}


// When a move is made via the UI, send that move and wait for a response move
function onMove(source: string, target: string, _piece: string,
    _newPos: string, _oldPos: string, _orientation: string): action {
    let move: string = source + "-" + target;
    if (gameState !== "playing")
        return "snapback";
    let moveResult: moveStatus = game.playerMove(move);
    if (!moveResult.move) {
        console.log("Invalid move:", moveResult.reason);
        return 'snapback';
    }
    updateStatus(moveResult.status);
    return 'drop';
}

function moveResponse(action: action): string | null {
    if (action !== "drop")
        return null;
    if (gameState !== "playing")
        return null;
    let response: moveStatus = game.AIMove();
    let AIMove: string | null = null;
    if (response && response.move)
        AIMove = unparse(response.move);
    if (!AIMove)
        console.error("No move made. Not updating");
    updateStatus(response.status);
    return AIMove;
}

function updateStatus(status: status) {
    gameState = status;
    if (status !== "playing") {
        window.alert("Game is over! " + status);
    }
}

let config: any = {
    'columns': files,
    'rows': ranks,
    'onDrop': onMove,
    'moveCallback': moveResponse,
    'draggable': true,
    'showErrors': 'console'
};
let board: any = chessboard.constructor('board1', config);
board.position(objToBoardObj(starting_position), ranks, files);
let gameState: status = "playing";

