import { parseMove } from "../../game/conversions.js";
import { Game, nextPlayer } from "../../game/gameModel.js";
import { Move, Player } from "../../models.js";
import starting_position from "../../positions/normal_chess.js";
import { SimpleRuleSet } from "../../rules/simplePieces.js";
import test_game from "./test_game.js";


export default () => {
    console.log("Testing Scholar's Mate game.");
    const game = test_game(new SimpleRuleSet(), starting_position(), dummyMoves);
    console.assert(game.gameStatus.player === Player.Black);
    console.assert(game.gameStatus.status === "loss");
}

const dummyMoves: Move[] = [
    parseMove("e2-e4") as Move,
    parseMove("e7-e5") as Move,
    parseMove("f1-c4") as Move,
    parseMove("b8-c6") as Move,
    parseMove("d1-h5") as Move,
    parseMove("g8-f6") as Move,
    parseMove("h5-f7") as Move,
    parseMove("a7-a6") as Move, // no check
    parseMove("f7-e8") as Move,
]
