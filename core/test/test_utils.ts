import { GameBoard, Location } from "../models.js";
import { blocked } from "../utils.js";
import emptyBoard from '../positions/normal_empty';

const loc1: Location = { 'rank': 1, 'file': 2 };
const loc2: Location = { 'rank': 1, 'file': 5 };
const loc3: Location = { 'rank': 6, 'file': 2 };
const loc4: Location = { 'rank': 3, 'file': 5 };
const loc5: Location = { 'rank': 8, 'file': 8 };
const loc6: Location = { 'rank': 1, 'file': 1 };
const loc7: Location = { 'rank': 8, 'file': 1 };
const loc8: Location = { 'rank': 1, 'file': 8 };

// this test is mostly to see the squares `blocked` considers.
export default () => {
    console.log("Testing blocked pieces. This test doesn't really cover anything.");

    console.assert(!blocked(emptyBoard, loc1, loc2), "", loc1, loc2);    // empty string to prevent object being used as format

    console.assert(!blocked(emptyBoard, loc1, loc3), "", loc1, loc3);

    console.assert(!blocked(emptyBoard, loc1, loc4), "", loc1, loc4);

    console.assert(!blocked(emptyBoard, loc4, loc1), "", loc4, loc1);

    console.assert(!blocked(emptyBoard, loc2, loc1), "", loc2, loc1);

    console.assert(!blocked(emptyBoard, loc3, loc1), "", loc3, loc1);

    console.assert(!blocked(emptyBoard, loc1, loc1), "", loc1, loc1);

    console.assert(!blocked(emptyBoard, loc6, loc5), "", loc6, loc5);

    console.assert(!blocked(emptyBoard, loc7, loc8), "", loc7, loc8);

}