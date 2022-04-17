
import { cloneBoard, updateWithMove } from "../game/gameModel.js";
import { Player } from "../models.js";
import normalBoard from "../positions/normal_chess.js";
import { SimpleBishop, SimpleRuleSet } from "../rules/simplePieces.js";
import { pieceAtLocation } from "../utils.js";


export default () => {
    console.log("Testing cloneBoard.");
    const ruleSet = new SimpleRuleSet();
    const board1 = ruleSet.initBoardPosition(normalBoard());
    const board2 = cloneBoard(board1);
    const board3 = cloneBoard(board1);
    console.assert(board1 !== board2);
    console.assert(board1 !== board3);
    console.assert(board2 !== board3);

    const loc = { 'file': 3, 'rank': 3 };
    board1.gamePieces.push(new SimpleBishop(loc, Player.White));
    console.assert(board1.gamePieces.length !== board2.gamePieces.length);
    console.assert(board1.gamePieces.length !== board3.gamePieces.length);
    console.assert(pieceAtLocation(board1, loc));
    console.assert(!pieceAtLocation(board2, loc));
    console.assert(!pieceAtLocation(board3, loc));

    // move knight
    const from = { 'file': 1, 'rank': 0 };
    const to = { 'file': 2, 'rank': 2 };
    updateWithMove(board2, { 'from': from, 'to': to });
    console.assert(pieceAtLocation(board1, from));
    console.assert(!pieceAtLocation(board2, from));
    console.assert(pieceAtLocation(board3, from));
    console.assert(!pieceAtLocation(board1, to));
    console.assert(pieceAtLocation(board2, to));
    console.assert(!pieceAtLocation(board3, to));
}