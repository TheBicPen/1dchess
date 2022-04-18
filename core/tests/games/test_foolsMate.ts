import { parseMove } from "../../game/conversions.js";
import { Move, Player } from "../../models.js";
import starting_position from "../../positions/normal_chess.js";
import { SimpleRuleSet } from "../../rules/simplePieces.js";
import test_game from "./test_game.js";


export default () => {
    console.log("Testing Fool's Mate game.");
    const game = test_game(new SimpleRuleSet(), starting_position(), dummyMoves);
    console.assert(game.gameStatus.player === Player.White);
    console.assert(game.gameStatus.status === "loss");
}

const dummyMoves: Move[] = [
    parseMove("f2-f3") as Move,
    parseMove("e7-e6") as Move,
    parseMove("g2-g4") as Move,
    parseMove("d8-h4") as Move,
    parseMove("e2-e3") as Move, // no check
    parseMove("h4-e1") as Move,
]
