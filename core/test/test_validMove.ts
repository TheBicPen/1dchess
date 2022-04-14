
import { GameBoard, Move, Player } from "../models.js";
import board from "../positions/normal_chess.js";
import { RuleSet } from "../rules/piece.js";
import { validMove } from "../rules/rules.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";

const ruleSet: RuleSet = new SimpleRuleSet();
const gameBoard: GameBoard = ruleSet.initBoardPosition(board());
export default () => {
    console.log("Testing validMove with simple pieces.");

    // Simple Pawn move
    const move1: Move = { 'from': { 'file': 0, 'rank': 1 }, 'to': { 'file': 0, 'rank': 2 } };
    console.assert(validMove(gameBoard, move1, Player.White), "", move1);   // empty string to prevent object being used as format


    // 2-square pawn move
    const move2: Move = { 'from': { 'file': 0, 'rank': 1 }, 'to': { 'file': 0, 'rank': 3 } };
    console.assert(validMove(gameBoard, move2, Player.White), "", move2);

    // no 3-square pawn move
    const move3: Move = { 'from': { 'file': 0, 'rank': 1 }, 'to': { 'file': 0, 'rank': 4 } };
    console.assert(!validMove(gameBoard, move3, Player.White), "", move3);

    // no moving opponent's pieces
    const move4: Move = { 'from': { 'file': 0, 'rank': 1 }, 'to': { 'file': 0, 'rank': 4 } };
    console.assert(!validMove(gameBoard, move4, Player.Black), "", move4);


    // Black Pawn move
    const move5: Move = { 'from': { 'file': 3, 'rank': 6 }, 'to': { 'file': 3, 'rank': 4 } };
    console.assert(validMove(gameBoard, move5, Player.Black), "", move5);


    // no en passant
    const move6: Move = { 'from': { 'file': 2, 'rank': 1 }, 'to': { 'file': 3, 'rank': 2 } };
    console.assert(!validMove(gameBoard, move6, Player.White), "", move6);


    // Knight move
    const move7: Move = { 'from': { 'file': 1, 'rank': 0 }, 'to': { 'file': 0, 'rank': 2 } };
    console.assert(validMove(gameBoard, move7, Player.White), "", move7);


    // Another Knight move
    const move8: Move = { 'from': { 'file': 1, 'rank': 0 }, 'to': { 'file': 2, 'rank': 2 } };
    console.assert(validMove(gameBoard, move8, Player.White), "", move8);


    // no knight self-capture
    const move9: Move = { 'from': { 'file': 1, 'rank': 0 }, 'to': { 'file': 3, 'rank': 1 } };
    console.assert(!validMove(gameBoard, move9, Player.White), "", move9);


    // no rook self-capture
    const move10: Move = { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 1 } };
    console.assert(!validMove(gameBoard, move10, Player.White), "", move10);


    // no rook self-capture
    const move11: Move = { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 1, 'rank': 0 } };
    console.assert(!validMove(gameBoard, move11, Player.White), "", move11);


    // no rook jumping squares
    const move12: Move = { 'from': { 'file': 0, 'rank': 0 }, 'to': { 'file': 0, 'rank': 3 } };
    console.assert(!validMove(gameBoard, move12, Player.White), "", move12);

    
}