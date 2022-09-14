


import { AIPlayer } from "../../core/ai/base.js";
import randomAI from "../../core/ai/random.js";
import { Draft } from "../../core/draft/draftModel.js";
import { boardToState, parseSquare, unparseMove, unparseSquare } from "../../core/game/conversions.js";
import { Game, GameStatus, MoveStatus, nextPlayer } from "../../core/game/gameModel.js";
import { Player } from "../../core/models.js";
import { knownDraft, knownGame, namedPositions, positionNames } from "../../core/game/knownGames.js";
import chessboard from "../../lib/chessboard.js";
import { objToBoardObj, parseObjPiece, unparseObjPiece } from "./core_adapter.js";
import { RuleSet } from "../../core/rules/piece.js";

type action = "snapback" | "trash" | "drop";


// global state
let theGame: Game;
let theDraft: Draft;
let theDraftGameRules: RuleSet;
const theCPU: AIPlayer = new randomAI();
let theBoardElement: Node | string;
let destroyTheBoard: (() => void) | undefined;
let doneCallback: ((status: GameStatus) => any) | undefined;


// When a move is made via the UI, send that move and wait for a response move
function onMove(source: string, target: string, _piece: string,
    _newPos: string, _oldPos: string, _orientation: string): action {
    const move: string = source + "-" + target;
    if (theGame?.checkStatus().status !== "playing")
        return "snapback";
    const moveResult: MoveStatus = theGame.makeMove(Player.White, move);
    if (!moveResult.move) {
        console.log("Invalid move:", moveResult.reason);
        return 'snapback';
    }
    console.log(moveResult);
    checkStatus();
    return 'drop';
}

// Callback for move: action is the action of the move that triggered the callback
// Get AI move.
function moveResponse(action: action): string | null {
    if (action !== "drop")
        return null;
    if (theGame?.checkStatus().status !== "playing")
        return null;
    const response: MoveStatus = theGame.makeMove(Player.Black, theCPU.move(theGame.gameBoard, Player.Black));
    const AIMove = response.move && unparseMove(response.move);
    if (AIMove)
        checkStatus();
    else
        console.error("No move made. Not updating");
    console.log(AIMove);
    return AIMove;
}

function checkStatus() {
    if (theGame?.checkStatus().status !== "playing") {
        doneCallback && doneCallback(theGame?.checkStatus());
    }
}

function startGame(element: string | Node, game: Game) {
    const board = boardToState(game.gameBoard);
    const ranks = board.boardDimensions.rank;
    const files = board.boardDimensions.file;
    const config = {
        'columns': files,
        'rows': ranks,
        'onDrop': onMove,
        'moveCallback': moveResponse,
        'draggable': true,
        'showErrors': 'console',
        'pieceTheme': '../img/chesspieces/wikipedia/{piece}.png'
    };
    theGame = game;
    const screenBoard = chessboard.constructor(element, config);
    screenBoard?.position(objToBoardObj(board), ranks, files);
}

function startDraft(element: string | Node, draft: Draft, gameRules: RuleSet) {
    const ranks = draft.board.boardDimensions.rank;
    const files = draft.board.boardDimensions.file;
    const draftConfig = {
        'columns': files,
        'rows': ranks,
        'onDrop': onDropDraft,
        'moveCallback': draftCallback,
        'sparePieces': true,
        'showErrors': 'console',
        'pieceTheme': '../img/chesspieces/wikipedia/{piece}.png'
    };
    theBoardElement = element;
    theDraft = draft;
    theDraftGameRules = gameRules;
    if (destroyTheBoard) destroyTheBoard();
    const draftBoard = chessboard.constructor(element, draftConfig);
    draftBoard?.position(objToBoardObj(draft.board), ranks, files);
    destroyTheBoard = draftBoard?.destroy;
}

function draftCallback(action: action) {
    if (action !== "drop")
        return;
    const pick = theCPU.draft(theDraft.rules, theDraft.board, Player.Black, theDraft.playerPoints.b);
    const pickResult = theDraft.choosePiece(Player.Black, pick);
    if (pickResult) {
        if (theDraft.done(Player.Black)) {
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
    if (source !== "spare" || target === "offboard" || !theDraft || theDraft.done(Player.White))
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
    if (theDraft.choosePiece(Player.White, { 'piece': thePiece.piece, 'player': Player.White, 'position': square })) {
        if (theDraft.done(Player.White)) {
            console.log("Draft is done. let's play!");
            startGameAfterDraft();
        }
        return "drop";
    } else {
        return "snapback";
    }
}

function startGameAfterDraft() {
    const files = theDraft.board.boardDimensions.file;
    const ranks = theDraft.board.boardDimensions.rank;
    const gameConfig = {
        'columns': files,
        'rows': ranks,
        'onDrop': onMove,
        'moveCallback': moveResponse,
        'draggable': true,
        'showErrors': 'console',
        'pieceTheme': '../img/chesspieces/wikipedia/{piece}.png'
    };
    theGame = new Game(theDraft.board, theDraftGameRules);
    if (destroyTheBoard) destroyTheBoard();
    const gameBoard = chessboard.constructor(theBoardElement, gameConfig);
    gameBoard?.position(objToBoardObj(theDraft.board), ranks, files);
    destroyTheBoard = gameBoard?.destroy;
}

export function fillPositionDropdown(element: Node) {
    positionNames.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.text = s;
        element.appendChild(opt);
    });
}

export function play(draft: boolean, dimString: namedPositions, element: string | Node, done?: (status: GameStatus) => any): void {
    doneCallback = done;
    if (draft)
        startDraft(element, knownDraft(dimString), knownGame(dimString).gameBoard.rules);
    else
        startGame(element, knownGame(dimString));

}
