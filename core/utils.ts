import { Location } from "./models";


// Return a list of possible positions
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