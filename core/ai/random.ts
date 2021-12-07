import { GameBoard, Player, Move } from "../models";
import { randItem } from "../utils";
import { AIPlayer } from "./interface";


export default class randomAI extends AIPlayer {
    move(position: GameBoard, player: Player): Move {
        return randItem(position.gamePieces
            .filter(p => p.state.player === player)
            .flatMap(p => p.getLegalMoves(position.rules.kingCheck, position)
                .map((t) => ({ 'from': p.state.position, 'to': t }))));

    }

}