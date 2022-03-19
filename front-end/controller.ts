


import chessboard from '../lib/chessboard.js'
import { MoveResult, MoveStatus, runAIGame, GameStatus } from '../core/game/game.js'
import { parseMove, unparse } from '../core/game/makeMove.js';
import starting_position from '../core/positions/1d_standard.js';
import { BoardState, Move, PiecePosition, PieceType, Player } from '../core/models.js';
import { fileToLetter } from '../core/utils.js';
import { AIPlayer } from '../core/ai/interface.js';
import randomAI from '../core/ai/random.js';
import { RuleSet } from '../core/rules/piece.js';
import { SimpleRuleSet1D } from '../core/rules/simplePieces1D.js';
import draftGame from '../core/game/draftGame.js'
import { DraftRules } from '../core/draft/draftRules.js';

type action = "snapback" | "trash" | "drop";



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
    let moveResult: MoveStatus = game.playerMove(move);
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
    let response: MoveStatus = game.AIMove();
    let AIMove: string | null = null;
    if (response && response.move)
        AIMove = unparse(response.move);
    if (!AIMove)
        console.error("No move made. Not updating");
    updateStatus(response.status);
    return AIMove;
}

function updateStatus(status: GameStatus) {
    gameState = status;
    if (status !== "playing") {
        window.alert("Game is over! " + status);
    }
}


// global state
let gameState: GameStatus;
let game: any;


export function startGame() {
    let files: number = 1;
    let ranks: number = 8;
    let CPU: AIPlayer = new randomAI(0);
    let ruleSet: RuleSet = new SimpleRuleSet1D();
    let config: any = {
        'columns': files,
        'rows': ranks,
        'onDrop': onMove,
        'moveCallback': moveResponse,
        'draggable': true,
        'showErrors': 'console'
    };
    game = runAIGame(ruleSet, CPU, starting_position);
    let board: any = chessboard.constructor('board1', config);
    board.position(objToBoardObj(starting_position), ranks, files);
    gameState = "playing";
}

export function startDraftGame() {
    let files: number = 2;
    let ranks: number = 8;
    const _onMove = (source: string, target: string, _piece: string,
        _newPos: string, _oldPos: string, _orientation: string) => {
        let move: string = source + "-" + target;
        nextMove = parseMove(move);
    }

    let config: any = {
        'columns': files,
        'rows': ranks,
        'onDrop': _onMove,
        'moveCallback': moveResponse,
        'draggable': true,
        'showErrors': 'console'
    };

    let draftState: "draft" | "game" = "draft";
    let nextMove: Move | null;
    let nextDraft: PiecePosition;
    function checkMove(resolve: any) {
        setTimeout(() => {
            if (nextMove)
                resolve(nextMove);
            else
                checkMove(resolve);
        }, 100);
    }
    function checkDraftpiece(resolve: any) {
        setTimeout(() => {
            if (nextDraft)
                resolve(nextDraft);
            else
                checkMove(resolve);
        }, 100);
    }
    let moveWaiter: Promise<Move> = new Promise<Move>((resolve, reject) => {
        checkMove(resolve);
    });

    let draftWaiter: Promise<PiecePosition> = new Promise<PiecePosition>((resolve, reject) => {
        checkDraftpiece(resolve);
    });


    game = draftGame(() => moveWaiter, (rules: DraftRules, board: BoardState, player: Player, points: number) => {
        return draftWaiter;
    })
    let board: any = chessboard.constructor('board1', config);
    board.position(objToBoardObj(starting_position), ranks, files);
    gameState = "playing";

}


