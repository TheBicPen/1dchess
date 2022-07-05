import { BoardState, Move, PiecePosition, PieceType, Player } from "../models.js";
import { GameBoard } from "./GameBoard.js";
import { GamePiece, RuleSet } from "../rules/piece.js";
import { validMoveWithReason } from "../rules/rules.js";
import { pieceAtLocation, pieceAtLocation2, printBoard } from "../utils/chessUtils.js";
import { boardToState, parseMove } from "./conversions.js";
import { chessClockRules, ChessClock } from "./chessClock.js";

export interface MoveResult {
    reason: string | null,
    move: Move | null,
}

type GameState = "playing" | "loss" | "draw";
type GameEndedReason = "timer" | "checkmate" | "stalemate";
export type GameStatus = { "status": GameState, player: Player, reason?: GameEndedReason };

export interface MoveStatus extends MoveResult {
    status: GameStatus
}

export class Game {

    gameBoard: GameBoard;
    gameStatus: GameStatus;
    clock?: ChessClock;

    constructor(board: BoardState, ruleSet: RuleSet, clock?: chessClockRules) {
        this.gameBoard = new GameBoard(board, ruleSet);
        this.gameStatus = { 'player': Player.White, "status": "playing" };
        if (clock)
            this.clock = new ChessClock(clock);
        this.gameStatus = checkGameState(this.gameBoard, this.gameStatus.player, this.clock);   // check for winning state immediately
    }


    makeMove(player: Player, move: Move | string): MoveStatus {

        if (typeof (move) === "string") {
            const _move = parseMove(move);
            if (!_move)
                return { 'move': null, 'reason': 'Parsing error', 'status': this.gameStatus };
            else
                move = _move;
        }

        if (this.gameStatus.player !== player)
            return { 'move': null, 'reason': 'Wrong player', 'status': this.gameStatus };

        const moveResult: MoveResult = validMoveWithReason(this.gameBoard, move, player);
        if (!moveResult.move) {
            return { ...moveResult, 'status': this.gameStatus };
        }

        updateWithMove(this.gameBoard, move);
        this.gameStatus.player = nextPlayer(this.gameStatus.player);
        if (this.clock)
            this.clock.increment(player); // increment next player
        this.gameStatus = checkGameState(this.gameBoard, this.gameStatus.player, this.clock);
        return { ...moveResult, 'status': this.gameStatus };
    }
    _printBoard() {
        printBoard(boardToState(this.gameBoard));
    }

}


///////////// exported to allow for unit testing

export function capture(board: GameBoard, piece: GamePiece) {
    board.gamePieces.splice(board.gamePieces.indexOf(piece), 1);
}

export function captureBoardState(board: BoardState, piece: PiecePosition) {
    board.pieces.splice(board.pieces.indexOf(piece), 1);
}

export function nextPlayer(player: Player) {
    return player === Player.White ? Player.Black : Player.White;
}

// move logic
export function updateWithMove(board: GameBoard, move: Move) {
    const piece: GamePiece | undefined = pieceAtLocation(board, move.from);
    // check target square before moving piece
    const capturePiece: GamePiece | undefined = pieceAtLocation(board, move.to);
    piece?.moveTo(move.to);
    if (capturePiece)
        capture(board, capturePiece);
}

// move logic for board states. Does not understand move logic
export function updatePositionWithMove(board: BoardState, move: Move) {
    const piece: PiecePosition | undefined = pieceAtLocation2(board, move.from);
    // check target square before moving piece
    const capturePiece: PiecePosition | undefined = pieceAtLocation2(board, move.to);
    if (piece)
        piece.position = move.to;
    if (capturePiece)
        captureBoardState(board, capturePiece);
}

export function cloneBoard(board: GameBoard): GameBoard {
    return new GameBoard(boardToState(board), board.rules);
}

// Return the game's status. Call this after making a move and updating the current player.
export function checkGameState(gameBoard: GameBoard, playerTurn: Player, clock?: ChessClock): GameStatus {
    if (clock && !clock.timers.w.alive)
        return { "player": Player.White, "status": "loss", "reason": "timer" };
    else if (clock && !clock.timers.b.alive)
        return { "player": Player.Black, "status": "loss", "reason": "timer" };
    const whiteKing: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.White && p.state.piece == PieceType.King);
    const blackKing: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.Black && p.state.piece == PieceType.King);
    const whiteMove: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.White && p.getLegalMoves(gameBoard.rules.rules.kingCheck, gameBoard).length > 0);
    const blackMove: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.Black && p.getLegalMoves(gameBoard.rules.rules.kingCheck, gameBoard).length > 0);

    if (playerTurn === Player.White ? !whiteKing : !blackKing)
        return { "player": playerTurn, "status": "loss", "reason": "checkmate" };
    else if (playerTurn === Player.White ? !whiteMove && whiteKing : !blackMove && blackKing)
        return { "player": playerTurn, "status": "draw", "reason": "stalemate" };
    else
        return { "player": playerTurn, "status": "playing" };
}
