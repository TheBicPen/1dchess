import { PiecePosition, Location, boardState, Move, GameBoard, Player, Piece } from "../models";
import { enumeratePositions } from "../utils";


// legalMove assumes that the target move is valid in principle, i.e. target is on the board
export interface GamePiece {
    state: PiecePosition;
    moveTo(location: Location): void;
    legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean;
    getLegalMoves(considerCheck: boolean, position: GameBoard): Location[];
    locationToMove(to: Location): Move;
}

export abstract class SimplePiece implements GamePiece {
    state: PiecePosition;
    moveTo(location: Location): void {
        this.state.position = location;
    }
    abstract legalMove(location: Location, considerCheck: boolean, position: GameBoard): boolean;

    getLegalMoves(considerCheck: boolean, position: GameBoard): Location[] {
        return enumeratePositions(position.boardDimensions).filter(x => this.legalMove(x, considerCheck, position));
    }
    locationToMove(to: Location): Move {
        return { "from": this.state.position, "to": to };
    }
    constructor(location: Location, player: Player, piece: Piece) {
        this.state = {'position': location, 'player': player, 'piece': piece};
    }

}