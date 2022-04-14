
import test_foolsMate from "./games/test_foolsMate.js";
import test_scholarsMate from "./games/test_scholarsMate.js";
import test_bishop from "./simplePieces/test_bishop.js";
import test_pawn from "./simplePieces/test_pawn.js";
import test_blocked from "./test_blocked.js";
import test_countPieces from "./test_countPieces.js";
import test_nextEmptySquare from "./test_nextEmptySquare.js";
import test_parsePiece from "./test_parsePiece.js";
import test_parseSquare from "./test_parseSquare.js";
import test_validMove from "./test_validMove.js";


test_blocked();
test_countPieces();
test_nextEmptySquare();
test_parsePiece();
test_parseSquare();
test_validMove();

// games
test_foolsMate();
test_scholarsMate();


// pieces
test_bishop();
test_pawn();
