
import { Player, Square } from "../models.js";
import standard_board from "../positions/normal_chess.js";
import pawns_4x4 from "../positions/4x4_fullpawns.js";
import { nextEmptySquare } from "../utils/chessUtils.js";
import empty from "../positions/empty.js";


export default () => {
    console.log("Testing next empty square.");
    const board_standard = standard_board();
    const board_empty = empty({ 'file': 8, 'rank': 8 });
    const board_pawns4x4 = pawns_4x4();
    const board_empty1x8 = empty({ 'file': 1, 'rank': 8 });
    let val: Square | null;

    val = nextEmptySquare(board_standard, Player.White);
    console.assert(val && val.file === 0 && val.rank === 2);

    val = nextEmptySquare(board_standard, Player.Black);
    console.assert(val && val.file === 7 && val.rank === 5);

    val = nextEmptySquare(board_empty, Player.White);
    console.assert(val && val.file === 0 && val.rank === 0);

    val = nextEmptySquare(board_empty, Player.Black);
    console.assert(val && val.file === 7 && val.rank === 7);

    val = nextEmptySquare(board_pawns4x4, Player.White);
    console.assert(val === null);

    val = nextEmptySquare(board_pawns4x4, Player.Black);
    console.assert(val === null);

    val = nextEmptySquare(board_empty1x8, Player.White);
    console.assert(val && val.file === 0 && val.rank === 0);

    val = nextEmptySquare(board_empty1x8, Player.Black);
    console.assert(val && val.file === 0 && val.rank === 7);


}