import { GameBoard, Player, Move } from "../models";
import { randItem } from "../utils";
import { AIPlayer } from "./interface";


export default class randomAI extends AIPlayer {
    move(position: GameBoard, player: Player): Move {
        return randItem(position.gamePieces
            .filter(x => x.state.player === player)
            .map(x => x.getLegalMoves(position.rules.kingCheck, position)));

    }

}