

import { parseSquare } from '../core/game/conversions.js';
import { GameBoard } from '../core/game/GameBoard.js';
import { MoveResult, updateWithMove } from '../core/game/gameModel.js';
import { Move } from '../core/models.js';
import empty from '../core/positions/empty.js';
import { validMoveWithReason } from '../core/rules/rules.js';
import { SimpleRuleSet } from '../core/rules/simplePieces.js';
import chessboard from '../lib/chessboard.js';
import * as controller from './game/controller.js'
import { parseObjPiece } from './game/core_adapter.js';

// allow any kind of movement
function onDropDemo(board: GameBoard, sourceStr: string, targetStr: string, pieceStr: string): controller.action {
    const piece = parseObjPiece(pieceStr);
    if (!piece) {
        console.error("can't parse piece!");
        return "snapback";
    }

    if (targetStr === "offboard" && sourceStr == "spare") {
        return "drop";
    } else if (targetStr === "offboard") {
        const sourceSquare = parseSquare(sourceStr);
        if (!sourceSquare) {
            console.error("can't parse source!");
            return "snapback";
        }
        const srcPieceIndex = board.gamePieces.findIndex(p => p.state.position.file === sourceSquare.file && p.state.position.rank === sourceSquare.rank);
        if (srcPieceIndex == -1) {
            console.error("can't find piece!");
            return "snapback";
        }
        board.gamePieces.splice(srcPieceIndex, 1);
    } else if (sourceStr == "spare") {
        const targetSquare = parseSquare(targetStr);
        if (!targetSquare) {
            console.error("can't parse target!");
            return "snapback";
        }
        board.gamePieces.push(board.rules.pieceToGamePiece({ 'piece': piece.piece, 'player': piece.player, 'position': targetSquare }));
    } else {
        const sourceSquare = parseSquare(sourceStr);
        if (!sourceSquare) {
            console.error("can't parse source!");
            return "snapback";
        }
        const targetSquare = parseSquare(targetStr);
        if (!targetSquare) {
            console.error("can't parse target!");
            return "snapback";
        }
        const move: Move = { from: sourceSquare, to: targetSquare };
        const moveResult: MoveResult = validMoveWithReason(board, move, piece.player);
        if (!moveResult.move) {
            console.error(moveResult.reason);
            return "snapback";
        }
        updateWithMove(board, move);
    }
    return "drop";
}

export function initDemoBoard(boardElement: Element) {
    const board = empty({ 'file': 8, 'rank': 8 });
    const gameBoard = new GameBoard(board, new SimpleRuleSet());
    // Don't bother filling out the game board - we can get the game piece by
    // parsing the piece on the square. This doesn't work for stateful pieces,
    // but should be OK for a demo
    const config = {
        'columns': board.boardDimensions.file,
        'rows': board.boardDimensions.rank,
        'onDrop': (source: string, square: string, piece: string, _oldPos: string, _newPos: string, _orientation: string) => {
            controller.onMouseoutSquare(boardElement);
            return onDropDemo(gameBoard, source, square, piece);
        },
        'onMouseoverSquare': (square: string) => controller.highlightLegalMoves(gameBoard, boardElement, square),
        'onMouseoutSquare': (_square: string) => controller.onMouseoutSquare(boardElement),
        'draggable': true,
        'dropOffBoard': 'trash',
        'showErrors': 'console',
        'sparePieces': true,
        'pieceTheme': 'img/chesspieces/wikipedia/{piece}.png'
    };
    chessboard.constructor(boardElement, config);
}