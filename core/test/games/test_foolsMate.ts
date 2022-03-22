import { parseMove } from "../../game/conversions";
import { Game, nextPlayer } from "../../game/game";
import { Move, Player } from "../../models";
import starting_position from "../../positions/normal_chess";
import { SimpleRuleSet } from "../../rules/simplePieces";


export default () => {

    console.log("Testing Fool's Mate game.");
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
