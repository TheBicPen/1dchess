
import * as models from "./models";


export function ZFenToBoardPosition(zfen: string): models.boardPosition {

    let fenParts: string[] = zfen.split(" ");
    let rows: string[] = fenParts[0].split("/");
    let nextMove: models.colour = models.colour[fenParts[1]];
    let enPassantTarget: models.square = parseSquare(fenParts[3]);
    let halfMoveClock: number = Number.parseInt(fenParts[4]);
    let fullMoveClock: number = Number.parseInt(fenParts[5]);
    let ranks: number = Number.parseInt(fenParts[6]);
    let files: number = Number.parseInt(fenParts[7]);
    let [castleWhite, castleBlack]: models.square[][] = fenCastleToModelCastle(fenParts[2], ranks, files);
    let pieces: models.piece[] = rows.flatMap((rowString, rank) => {
        let row = rowString.split(/(\d+)/).flatMap(x => Number.parseInt(x) ? Array(Number.parseInt(x)).fill(0) : x);
        if (row.length !== files)
            return;
        row.flatMap((sq, file) => typeof sq === "string" ? { ...parsePiece, rank: rank, file: file } : null);
        return row.filter(x => x);
    });

    return {
        ranks: ranks,
        files: files,
        nextMove: nextMove,
        enPassantTarget: enPassantTarget,
        fullMoveNumber: fullMoveClock,
        halfMoveClock: halfMoveClock,
        blackPlayer: { castlePossibilities: castleBlack },
        whitePlayer: { castlePossibilities: castleWhite },
        pieces: pieces
    };
}

function fenCastleToModelCastle(fenCastle: string, ranks: number, files: number): models.square[][] {
    if (fenCastle === "-")
        return [[], []]


    let blackCastle: models.square[] = [];
    let whiteCastle: models.square[] = [];
    if (fenCastle.includes("K"))
        whiteCastle.push({ rank: 0, file: files - 1 });
    if (fenCastle.includes("Q"))
        whiteCastle.push({ rank: 0, file: 0 });
    if (fenCastle.includes("k"))
        whiteCastle.push({ rank: ranks - 1, file: files - 1 });
    if (fenCastle.includes("q"))
        whiteCastle.push({ rank: ranks - 1, file: 0 });
    return [whiteCastle, blackCastle];
}

function parseSquare(square: string): models.square {
    return square.length >= 2 && { file: "abcdefghijklmnopqrstuvwxyz".indexOf(square[0]), rank: Number.parseInt(square.slice(1)) };
}

function parsePiece(piece: string): { type: models.pieceType, colour: models.colour } {
    return piece.length > 0 && { type: models.pieceType[piece.toUpperCase()], colour: piece.toUpperCase() === piece ? models.colour.white : models.colour.black };
}
