


import chessboard from "../lib/chessboard.js";
import { Game, MoveStatus } from "../core/game/gameModel.js";
import { parsePiece, parseSquare, unparseMove, unparseSquare } from "../core/game/conversions.js";
import starting_position from "../core/positions/1d_standard.js";
import empty_position from "../core/positions/1x8_empty.js";
import { BoardState, Player } from "../core/models.js";
import { Draft } from "../core/draft/draftModel.js";
import { AIPlayer } from "../core/ai/interface.js";
import randomAI from "../core/ai/random.js";
import { RuleSet } from "../core/rules/piece.js";
import { SimpleRuleSet1D } from "../core/rules/simplePieces1D.js";
import { objToBoardObj, parseObjPiece, unparseObjPiece } from "./core_adapter.js";
import { DraftRules } from "../core/draft/draftRules.js";
import draftRules1D from "../core/draft/1dDraftRules.js";

type action = "snapback" | "trash" | "drop";



// When a move is made via the UI, send that move and wait for a response move
function onMove(source: string, target: string, _piece: string,
    _newPos: string, _oldPos: string, _orientation: string): action {
    const move: string = source + "-" + target;
    if (game?.gameStatus.status !== "playing")
        return "snapback";
    const moveResult: MoveStatus = game.makeMove(Player.White, move);
    if (!moveResult.move) {
        console.log("Invalid move:", moveResult.reason);
        return 'snapback';
    }
    checkStatus();
    return 'drop';
}

// Callback for move: action is the action of the move that triggered the callback
// Get AI move.
function moveResponse(action: action): string | null {
    if (action !== "drop")
        return null;
    if (game?.gameStatus.status !== "playing")
        return null;
    const response: MoveStatus = game.makeMove(Player.Black, CPU.move(game.gameBoard, Player.Black));
    const AIMove = response.move && unparseMove(response.move);
    if (AIMove)
        checkStatus();
    else
        console.error("No move made. Not updating");
    return AIMove;
}

function checkStatus() {
    if (game?.gameStatus.status === "draw")
        window.alert(`Game is over! It's a draw!`);
    if (game?.gameStatus.status === "loss")
        window.alert(`Game is over! ${game.gameStatus.player} lost!`);

}


// global state
let game: Game;
let draft: Draft;
const CPU: AIPlayer = new randomAI(0);
const draftRules: DraftRules = draftRules1D;
let _element: Node | string;

export function startGame(element: string | Node) {
    const files = 1;
    const ranks = 8;
    const ruleSet: RuleSet = new SimpleRuleSet1D();
    const board: BoardState = starting_position;
    const config = {
        'columns': files,
        'rows': ranks,
        'onDrop': onMove,
        'moveCallback': moveResponse,
        'draggable': true,
        'showErrors': 'console'
    };

    game = new Game(ruleSet, board);
    const screenBoard = chessboard.constructor(element, config);
    screenBoard?.position(objToBoardObj(board), ranks, files);
}

export function startDraftGame(element: string | Node) {
    const files = 1;
    const ranks = 8;

    const board: BoardState = empty_position;
    const draftConfig = {
        'columns': files,
        'rows': ranks,
        'onDrop': onDropDraft,
        'moveCallback': draftCallback,
        'sparePieces': true,
        'showErrors': 'console'
    };
    _element = element;
    draft = new Draft(board, draftRules, Player.White);
    const draftBoard = chessboard.constructor(element, draftConfig);
    draftBoard?.position(objToBoardObj(board), ranks, files);
}

function draftCallback(action: action) {
    if (action !== "drop")
        return;
    const pick = CPU.draft(draftRules, draft.board, Player.Black, draft.playerPoints.b);
    const pickResult = draft.choosePiece(Player.Black, pick);
    if (pickResult)
    {
        if (draft.done(Player.Black)) {
            console.log("Draft is done. let's play!");
            startGameAfterDraft();
        }
        return { 'playerPiece': unparseObjPiece(pick.piece, pick.player), 'target': unparseSquare(pick.position) };
    }
    else
        console.error("AI pick invalid");

}

function onDropDraft(source: string, target: string, piece: string, _oldPos: string, _newPos: string, _orientation: string): action {
    // only allow placing pieces onto the board    
    if (source !== "spare" || target === "offboard" || !draft || draft.done(Player.White))
        return "snapback";
    const thePiece = parseObjPiece(piece);
    if (!thePiece) {
        console.error("can't parse piece!");
        return "snapback";
    }
    const square = parseSquare(target);
    if (!square) {
        console.error("can't parse target!");
        return "snapback";
    }
    if (draft.choosePiece(Player.White, { 'piece': thePiece.piece, 'player': Player.White, 'position': square })) {
        if (draft.done(Player.White)) {
            console.log("Draft is done. let's play!");
            startGameAfterDraft();
        }
        return "drop";
    } else {
        return "snapback";
    }
}

function startGameAfterDraft() {
    const ruleSet: RuleSet = new SimpleRuleSet1D();
    const files = 1;
    const ranks = 8;
    const gameConfig = {
        'columns': files,
        'rows': ranks,
        'onDrop': onMove,
        'moveCallback': moveResponse,
        'draggable': true,
        'showErrors': 'console'
    };
    game = new Game(ruleSet, draft.board);
    const gameBoard = chessboard.constructor(_element, gameConfig);
    gameBoard?.position(objToBoardObj(draft.board), ranks, files);
}
