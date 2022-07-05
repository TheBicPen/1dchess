import { nextPlayer } from "../game/gameModel.js";
import { BoardState, PiecePosition, PieceType, Player, Square } from "../models.js";
import { nextEmptySquare } from "../utils/chessUtils.js";
import { validateDraftChoice } from "./draftController.js";
import { DraftRules } from "./draftRules.js";



export class Draft {

    board: BoardState;
    rules: DraftRules;
    nextPlayer: Player;
    rounds: number;
    playerPoints: { [p in Player]: number };

    constructor(initBoard: BoardState, rules: DraftRules, initPlayer: Player) {
        this.board = initBoard;
        this.rules = rules;
        this.nextPlayer = initPlayer;
        this.playerPoints = { 'b': rules.startingPoints, 'w': rules.startingPoints };
        this.rounds = rules.rounds * 2; // rounds is the number of moves, but we track plies

        if (!initBoard.pieces.some(p => p.player === Player.White && p.piece === PieceType.King))
            initBoard.pieces.push({ 'position': nextEmptySquare(initBoard, Player.White) as Square, 'player': Player.White, 'piece': PieceType.King });
        if (!initBoard.pieces.some(p => p.player === Player.Black && p.piece === PieceType.King))
            initBoard.pieces.push({ 'position': nextEmptySquare(initBoard, Player.Black) as Square, 'player': Player.Black, 'piece': PieceType.King });

    }

    choosePiece(player: Player, piecePos: PiecePosition): boolean {
        if (this.nextPlayer !== player || this.rounds === 0)
            return false;
        else if (validateDraftChoice(this.rules, this.board, player, this.playerPoints[player], piecePos)) {
            this.board.pieces.push(piecePos);
            this.playerPoints[player] -= this.rules.pieceCost[piecePos.piece];
            this.rounds -= 1;   // each this.round is a ply
            this.nextPlayer = nextPlayer(player);
            return true;
        } else {
            return false;
        }
    }

    done(player: Player): boolean {
        return this.rounds === 0
            || this.playerPoints[player] < Math.min(...Object.values(this.rules.pieceCost))
            || !nextEmptySquare(this.board, player);
    }

}