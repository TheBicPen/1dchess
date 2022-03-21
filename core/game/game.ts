import { BoardState, GameBoard, Move, PieceType, Player } from "../models.js";
import { GamePiece, RuleSet } from "../rules/piece.js";
import { validMoveWithReason } from "../rules/rules.js";
import { pieceAtLocation } from "../utils.js";
import { parseMove } from "./conversions.js";

export interface MoveResult {
    reason: string | null,
    move: Move | null,
}

type GameState = "playing" | "loss" | "draw";
export type GameStatus = { "status": GameState, player: Player };

export interface MoveStatus extends MoveResult {
    status: GameStatus
};

export class Game {

    gameBoard: GameBoard;
    gameStatus: GameStatus;

    constructor(ruleSet: RuleSet, board: BoardState) {
        this.gameBoard = ruleSet.initBoardPosition(board);
        this.gameStatus = { 'player': Player.White, "status": "playing" };
        this.gameStatus = checkGameState(this.gameBoard, this.gameStatus.player);   // check for winning state immediately
    }


    makeMove(player: Player, move: Move | string): MoveStatus {

        if (typeof (move) === "string") {
            let _move = parseMove(move);
            if (!_move)
                return { 'move': null, 'reason': 'Parsing error', 'status': this.gameStatus };
            else
                move = _move;
        }

        if (this.gameStatus.player !== player)
            return { 'move': null, 'reason': 'Wrong player', 'status': this.gameStatus };

        let moveResult: MoveResult = validMoveWithReason(this.gameBoard, move, player);
        if (!moveResult.move) {
            return { ...moveResult, 'status': this.gameStatus };
        }

        updateWithMove(this.gameBoard, move);
        this.gameStatus.player = nextPlayer(this.gameStatus.player);
        this.gameStatus = checkGameState(this.gameBoard, this.gameStatus.player);
        return { ...moveResult, 'status': this.gameStatus };
    }

}


///////////// exported to allow for unit testing
///////////// also since ES5 doesn't support private members

export function capture(board: GameBoard, piece: GamePiece) {
    board.gamePieces.splice(board.gamePieces.indexOf(piece), 1);
}

export function nextPlayer(player: Player) {
    return player === Player.White ? Player.Black : Player.White;
}

// move logic
export function updateWithMove(board: GameBoard, move: Move) {
    let piece: GamePiece | undefined = pieceAtLocation(board, move.from);
    // check target square before moving piece
    let capturePiece: GamePiece | undefined = pieceAtLocation(board, move.to);
    piece?.moveTo(move.to);
    if (capturePiece)
        capture(board, capturePiece);
}

// Return the game's status. Call this after making a move and updating the current player.
export function checkGameState(gameBoard: GameBoard, playerTurn: Player): GameStatus {
    const whiteKing: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.White && p.state.piece == PieceType.King);
    const blackKing: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.Black && p.state.piece == PieceType.King);
    const whiteMove: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.White && p.getLegalMoves(gameBoard.rules.kingCheck, gameBoard).length > 0);
    const blackMove: boolean = gameBoard.gamePieces.some(p => p.state.player == Player.Black && p.getLegalMoves(gameBoard.rules.kingCheck, gameBoard).length > 0);

    if (playerTurn === Player.White ? !whiteKing : !blackKing)
        return { "player": playerTurn, "status": "loss" };
    else if (playerTurn === Player.White ? !whiteMove && whiteKing : !blackMove && blackKing)
        return { "player": playerTurn, "status": "draw" };
    else
        return { "player": playerTurn, "status": "playing" };
}
