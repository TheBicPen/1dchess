import { parseMove } from "../../game/conversions";
import { Game, nextPlayer } from "../../game/gameModel";
import { Move, Player } from "../../models";
import starting_position from "../../positions/normal_chess";
import { SimpleRuleSet } from "../../rules/simplePieces";


export default () => {

    console.log("Testing Scholar's Mate game.");
    const ruleSet = new SimpleRuleSet();
    const game = new Game(ruleSet, starting_position);
    let player = Player.White;
    while (dummyMoves.length > 0) {
        const element = dummyMoves.shift();
        console.assert(game.gameStatus.status === "playing");
        console.assert(game.gameStatus.player === player);
        // game._printBoard();
        const result = game.makeMove(player, element as Move);
        player = nextPlayer(player);
        console.assert(result.move);
        console.assert(!result.reason);
        console.assert(result.status.player === player);
    }
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
