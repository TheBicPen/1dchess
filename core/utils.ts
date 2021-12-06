import { GameBoard, Location } from "./models";
import { GamePiece } from "./rules/piece";


// Return a list of possible positions within dimensions
export function enumeratePositions(dimensions: Location) {
    const ranks = range(dimensions.rank);
    const files = range(dimensions.file);
    // 2-ary Cartesian product
    return ranks.flatMap(x => files.map(y => { return { rank: x, file: y } as Location }));
}


// Return array containing 0 to val-1, inclusive.
export function range(val: number) {
    return [... new Array(val).keys()];
}


// Random element in range
export function randRange(val: number) {
    return Math.floor(Math.random() * val);
}

// Random element in range
export function randItem(arr: any[]) {
    return arr[randRange(arr.length)];
}


export function letterToFile(c: string): number | null {
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    let idx: number = letters.indexOf(c);
    return idx === -1 ? null : idx;
}

export function pieceAtLocation(board: GameBoard, location: Location): GamePiece | undefined {
    return board.gamePieces.find(x=>x.state.position.file === location.file && x.state.position.rank === location.rank);
}

// returns whether there are any pieces blocking the straight line from from to to
export function blocked(board: GameBoard, from:Location, to:Location): boolean {
    let cur: Location = Object.assign({}, from);
    let file_diff = Math.abs(to.file - from.file);
    let rank_diff = Math.abs(to.rank - from.rank);
    let rank_up = to.rank > from.rank ? 1 : -1;
    let file_up = to.file > from.file ? 1 : -1;
    // exclude destination square
    while (file_diff > 1 || rank_diff > 1) {    
        //move diagonally whenever possible
        if (file_diff > 1 && rank_diff > 1) { 
            cur.rank += rank_up;
            cur.file += file_up;
            rank_diff -= 1;
            file_diff -= 1;
        }
        else if (rank_diff > file_diff) {
            cur.rank += rank_up;
            rank_diff -= 1;
        } else {
            cur.file += file_up;
            file_diff -= 1;
        }
        if(pieceAtLocation(board, cur))
            return true;
        // console.debug(cur);
    }
    return false;
}