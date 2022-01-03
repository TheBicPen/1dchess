


import chessboard from '../lib/chessboard.js'
import { moveResult, runAIGame } from '../core/game/game.js'
import { unparse } from '../core/game/makeMove.js';
import starting_position from '../core/positions/1d_standard.js';
import { BoardState } from '../core/models.js';
import { fileToLetter } from '../core/utils.js';
import { AIPlayer } from '../core/ai/interface.js';
import randomAI from '../core/ai/random.js';
import { RuleSet } from '../core/rules/piece.js';
import { SimpleRuleSet1D } from '../core/rules/simplePieces1D.js';
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
function onMove(callback: (AIMove: string) => void,
    source: string, target: string, _piece: string,
    _newPos: string, _oldPos: string, _orientation: string): string {
    let move: string = source + "-" + target;
    let moveResult: moveResult = game.playerMove(move);
    if (!moveResult.move) {
        console.log("Invalid move:", moveResult.reason);
        return 'snapback';
    }
    let AIMove: string | null = unparse(game.AIMove());
    if (AIMove) callback(AIMove);
    else console.error("No move made. Not updating");
    return 'drop';
}

let config: any = {
    'columns': files,
    'rows': ranks,
    'onDrop': onMove,
    'moveCallback': true,
    'draggable': true,
    'showErrors': 'console'
};
let board: any = chessboard.constructor('board1', config);
board.position(objToBoardObj(starting_position), ranks, files);


