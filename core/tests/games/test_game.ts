import { Game, nextPlayer } from "../../game/gameModel.js";
import { BoardState, Move, Player } from "../../models.js";
import { RuleSet } from "../../rules/piece.js";


// Function to simplify testing full games. Returns the game state so that it can be further examined by the caller.
export default (ruleSet: RuleSet, position: BoardState, dummyMoves: Move[]): Game => {
    const game = new Game(position, ruleSet);
    let player = Player.White;
    while (dummyMoves.length > 0) {
        const element = dummyMoves.shift();
        console.assert(game.checkStatus().status === "playing");
        console.assert(game.checkStatus().player === player);
        // game._printBoard();
        const result = game.makeMove(player, element as Move);
        player = nextPlayer(player);
        console.assert(result.move);
        console.assert(!result.reason);
        console.assert(result.status.player === player);
    }
    return game;
}
