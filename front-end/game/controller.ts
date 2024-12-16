


import { AIPlayer } from "../../core/ai/base.js";
import randomAI from "../../core/ai/random.js";
import { Draft } from "../../core/draft/draftModel.js";
import { boardToState, parseSquare, unparseMove, unparseSquare } from "../../core/game/conversions.js";
import { Game, GameStatus, MoveStatus } from "../../core/game/gameModel.js";
import { Player } from "../../core/models.js";
import { knownDraft, knownGame, namedPositions, positionNames } from "../../core/game/knownGames.js";
import chessboard from "../../lib/chessboard.js";
import { objToBoardObj, parseObjPiece, unparseObjPiece } from "./core_adapter.js";
import { RuleSet } from "../../core/rules/piece.js";
import { pieceAtLocation } from "../../core/utils/chessUtils.js";
import { GameBoard } from "../../core/game/GameBoard.js";
type action = "snapback" | "trash" | "drop";


export class GameOnPage {
    theGame: Game | undefined;
    theDraft: Draft | undefined;
    theDraftGameRules: RuleSet | undefined;
    readonly theCPU: AIPlayer = new randomAI();
    theBoardElement: Element;
    destroyTheBoard: (() => void) | undefined;
    doneCallback: ((status: GameStatus) => void);

    constructor(draft: boolean, dimString: namedPositions, element: Element, done: (status: GameStatus) => void) {
        this.doneCallback = done;
        this.theBoardElement = element;
        if (draft)
            this.startDraft(knownDraft(dimString), knownGame(dimString).gameBoard.rules);
        else
            this.startGame(knownGame(dimString));
    }

    // When a move is made via the UI, send that move and wait for a response move.
    // callbacks need to capture `this` so we use an arrow function
    private onMove = (source: string, target: string, _piece: string, _newPos: string, _oldPos: string, _orientation: string): action => {
        const move: string = source + "-" + target;
        if (this.theGame?.checkStatus().status !== "playing")
            return "snapback";
        const moveResult: MoveStatus = this.theGame.makeMove(Player.White, move);
        if (!moveResult.move) {
            console.log("Invalid move:", moveResult.reason);
            return 'snapback';
        }
        console.log(moveResult);
        this.maybeEndGame();
        return 'drop';
    }

    // Callback for move: action is the action of the move that triggered the callback
    // Get AI move.
    private moveResponse = (action: action): string | null => {
        if (action !== "drop")
            return null;
        if (this.theGame?.checkStatus().status !== "playing")
            return null;
        const response: MoveStatus = this.theGame.makeMove(Player.Black, this.theCPU.move(this.theGame.gameBoard, Player.Black));
        const AIMove = response.move && unparseMove(response.move);
        if (AIMove)
            this.maybeEndGame();
        else
            console.error("No move made. Not updating");
        console.log(AIMove);
        this.theGame?._printBoard();
        return AIMove;
    }

    private onMouseoverSquare = (square: string, piece: string) => {
        if (!piece || this.theGame!.checkStatus().status !== "playing")
            return;
        highlightLegalMoves(this.theGame!.gameBoard, this.theBoardElement, square);
    }

    private onMouseoutSquare = (_square: string, _piece: string) => {
        onMouseoutSquare(this.theBoardElement);
    }

    private maybeEndGame() {
        if (this.theGame?.checkStatus().status !== "playing") {
            this.doneCallback(this.theGame!.checkStatus());
        }
    }

    private startDraft(draft: Draft, gameRules: RuleSet) {
        const ranks = draft.board.boardDimensions.rank;
        const files = draft.board.boardDimensions.file;
        const draftConfig = {
            'columns': files,
            'rows': ranks,
            'onDrop': this.onDropDraft,
            'moveCallback': this.draftCallback,
            'sparePieces': true,
            'showErrors': 'console',
            'pieceTheme': '../img/chesspieces/wikipedia/{piece}.png'
        };
        this.theDraft = draft;
        this.theDraftGameRules = gameRules;
        if (this.destroyTheBoard) this.destroyTheBoard();
        const draftBoard = chessboard.constructor(this.theBoardElement, draftConfig);
        draftBoard?.position(objToBoardObj(draft.board), ranks, files);
        this.destroyTheBoard = draftBoard?.destroy;
    }

    private startGame(game: Game) {
        const board = boardToState(game.gameBoard);
        const ranks = board.boardDimensions.rank;
        const files = board.boardDimensions.file;
        const config = {
            'columns': files,
            'rows': ranks,
            'onDrop': this.onMove,
            'onMouseoverSquare': this.onMouseoverSquare,
            'onMouseoutSquare': this.onMouseoutSquare,
            'moveCallback': this.moveResponse,
            'draggable': true,
            'showErrors': 'console',
            'pieceTheme': '../img/chesspieces/wikipedia/{piece}.png'
        };
        this.theGame = game;
        const screenBoard = chessboard.constructor(this.theBoardElement, config);
        screenBoard?.position(objToBoardObj(board), ranks, files);
    }

    private draftCallback = (action: action) => {
        if (action !== "drop")
            return;
        const pick = this.theCPU.draft(this.theDraft!.rules, this.theDraft!.board, Player.Black, this.theDraft!.playerPoints.b);
        const pickResult = this.theDraft!.choosePiece(Player.Black, pick);
        if (pickResult) {
            if (this.theDraft!.done(Player.Black)) {
                console.log("Draft is done. let's play!");
                this.startGameAfterDraft();
            }
            return { 'playerPiece': unparseObjPiece(pick.piece, pick.player), 'target': unparseSquare(pick.position) };
        }
        else
            console.error("AI pick invalid");

    }

    private onDropDraft = (source: string, target: string, piece: string, _oldPos: string, _newPos: string, _orientation: string): action => {
        // only allow placing pieces onto the board
        if (source !== "spare" || target === "offboard" || !this.theDraft || this.theDraft.done(Player.White))
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
        if (this.theDraft.choosePiece(Player.White, { 'piece': thePiece.piece, 'player': Player.White, 'position': square })) {
            if (this.theDraft.done(Player.White)) {
                console.log("Draft is done. let's play!");
                this.startGameAfterDraft();
            }
            return "drop";
        } else {
            return "snapback";
        }
    }

    private startGameAfterDraft() {
        const files = this.theDraft!.board.boardDimensions.file;
        const ranks = this.theDraft!.board.boardDimensions.rank;
        const gameConfig = {
            'columns': files,
            'rows': ranks,
            'onDrop': this.onMove,
            'onMouseoverSquare': this.onMouseoverSquare,
            'onMouseoutSquare': this.onMouseoutSquare,
            'moveCallback': this.moveResponse,
            'draggable': true,
            'showErrors': 'console',
            'pieceTheme': '../img/chesspieces/wikipedia/{piece}.png'
        };
        this.theGame = new Game(this.theDraft!.board, this.theDraftGameRules!);
        if (this.destroyTheBoard) this.destroyTheBoard();
        const gameBoard = chessboard.constructor(this.theBoardElement, gameConfig);
        gameBoard?.position(objToBoardObj(this.theDraft!.board), ranks, files);
        this.destroyTheBoard = gameBoard?.destroy;
    }
}

export function highlightLegalMoves(board: GameBoard, boardElement: Element, square: string) {
    const boardSquare = parseSquare(square);
    const boardPiece = pieceAtLocation(board, boardSquare!);
    boardPiece?.getLegalMoves(false, board).forEach(targetSquare => {
        const unparsedTarget = unparseSquare(targetSquare);
        const squareNode = boardElement.querySelector(`.square-${unparsedTarget}`)!;
        const highlightClass = squareNode.classList.contains('black-3c85d')
            ? 'black-highlight' : 'white-highlight';
        squareNode.classList.add(highlightClass);
    });
}

export function onMouseoutSquare(boardElement: Element) {
    boardElement.querySelectorAll(".white-highlight").forEach(el => {
        el.classList.remove("white-highlight");
    });
    boardElement.querySelectorAll(".black-highlight").forEach(el => {
        el.classList.remove("black-highlight");
    });
}

export function fillPositionDropdown(element: Node) {
    positionNames.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.text = s;
        element.appendChild(opt);
    });
}
