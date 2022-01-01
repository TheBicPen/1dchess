


import chessboard from '../lib/chessboard.js'
import { runAIGame } from '../core/game/game'
import { unparse } from '../core/game/makeMove';
let files: number = 1;
let ranks: number = 10;
let game: any = runAIGame();


// When a move is made via the UI, send that movwe and wait for a response move
function onMove(callback: (AIMove: string) => void, move: string) {
    game.playerMove(move);
    let AIMove: string | null = unparse(game.AIMove());
    if (AIMove) callback(AIMove);
    else console.error("No move made. Not updating");
}

let config: any = {
    'columns': files,
    'rows': ranks,
    'onDrop': onMove,
    'moveCallback':true
};
let board: any = chessboard.constructor('board1', config);


