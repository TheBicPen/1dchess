import { PiecePosition, Location, Position, Move, GameBoard } from "../models";
import { enumeratePositions } from "../utils";


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
    abstract legalMove(location: Location, considerCheck: boolean, position: GameBoard);

    getLegalMoves(considerCheck: boolean, position: GameBoard): Location[] {
        return enumeratePositions(position.boardDimensions).filter(x=>this.legalMove(x, considerCheck, position));
    }
    locationToMove(to: Location): Move {
        return {"from": this.state.position, "to": to};
    }
    
}