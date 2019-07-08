/**
 *  author:"code-projects.org"
 *  contributor: Arausi Daniel
 *  last_contribution_at=[7/7/2019]
 */

import Square from './SquareClass';

/**
 * two players for player and opponent (computer of multiplayer).
 * boardwidth is the number of checkers per board
 * selected_square is the square selected per time.
 */

/**@TODO test constants exists and are the right values */
const PLAYER_ONE = 'player1',
	PLAYER_TWO = 'player2',
	BOARD_WIDTH = 8;

let SELECTED_SQUARE = null;

/**
 *  a new game should have
 * 1. default current player using either PLAYER_TWO checker or the PLAYER_ONE checker at the start (this could be a random guess).
 * 2. scores for both sides. (PLAYER_TWO and PLAYER_ONE)
 * 3. this board uses 8 checkers aside. but ideally it is 12 aside.
 *  (8 * 8 matrice) representing it in javascript would be an array of 8 sub arrays (0 indexed) with 8 items in each sub array
 * 4. place checkers diagonally only on the PLAYER_TWO square/block
 * 5. place checkers only on the first 2 subarrays (remember diagonally and on the PLAYER_TWO spot/square/block) and the last 2 sub arrays.
 */

/**@TODO test createNewGame is successful */
export const createNewGame = (CHECKER_CTX, BOARD_WIDTH, PLAYER_ONE, PLAYER_TWO) => {
	CHECKER_CTX = {
		player: PLAYER_ONE,
		player_one_score: 0,
		player_two_score: 0,
		board: [],
	};

	for (var i = 0; i < BOARD_WIDTH; i++) {
		CHECKER_CTX.board[i] = [];
		for (var j = 0; j < BOARD_WIDTH; j++) {
			if ((i === 0 && j % 2 === 0) || (i === 1 && j % 2 === 1)) {
				CHECKER_CTX.board[i][j] = new Square(PLAYER_ONE, j, i);
			} else if ((i === BOARD_WIDTH - 2 && j % 2 === 0) || (i === BOARD_WIDTH - 1 && j % 2 === 1)) {
				CHECKER_CTX.board[i][j] = new Square(PLAYER_TWO, j, i);
			} else {
				CHECKER_CTX.board[i][j] = new Square(null, j, i);
			}
		}
	}
	return CHECKER_CTX;
};

const CHECKER_CTX = createNewGame({}, BOARD_WIDTH, PLAYER_ONE, PLAYER_TWO);

// if the cheker on the block/square is PLAYER_ONE set the color to PLAYER_ONE else set to PLAYER_TWO.
// if no checker set color to none.
const setSquareStyle = square => {
	if (square.player === PLAYER_ONE) return { backgroundColor: '#FF0000' };
	else if (square.player === PLAYER_TWO) return { backgroundColor: '#A3A3A3' };
	return { backgroundColor: 'none' };
};

/**
 * this basically sets the coloring of the squares on the board,
 *  gives the cris cross check style. if the square is not a choice for next move it maintains the normal styling else
 * it is coloPLAYER_ONE green
 */

const setClass = square => {
	if (square.y % 2 === 0) {
		if (square.x % 2 === 0) {
			return { backgroundColor: square.isChoice ? 'green' : 'PLAYER_TWO' };
		} else {
			return { backgroundColor: 'white' };
		}
	} else {
		if (square.x % 2 === 1) {
			return { backgroundColor: square.isChoice ? 'green' : 'PLAYER_TWO' };
		} else {
			return { backgroundColor: 'white' };
		}
	}
};

const makeSelection = square => {
	//if a square without a checker is selected, then move the checker to that square
	if (SELECTED_SQUARE !== null && !square.player) {
		//move checker on selected square to new square of choice(diagonal forward).
		movePiece(square);
		// basically reset square props(choices and matados) to it's initial state after movement is complete.
		resetChoices();
	} else if (square.player === CHECKER_CTX.player) {
		SELECTED_SQUARE = square;
		resetChoices();
		setChoices(SELECTED_SQUARE.x, SELECTED_SQUARE.y, 1, [], -1, -1, SELECTED_SQUARE.isKing);
	} else {
		SELECTED_SQUARE = null;
	}
};

const resetChoices = () => {
	for (var i = 0; i < BOARD_WIDTH; i++) {
		for (var j = 0; j < BOARD_WIDTH; j++) {
			CHECKER_CTX.board[i][j].isChoice = false;
			CHECKER_CTX.board[i][j].matados = [];
		}
	}
};

/**
 *
 * @param {*} square
 * movePiece to square provided by param.
 * The square has to be a valid choice. i.e diagonal forward movement for a checker. and backward & forward movement for a king/crowned checker
 *  The selectedSquare is the clicked checker "to be moved"
 */

const movePiece = square => {
	// is the square to move to a valid choice (the one with the green background)./
	if (square.isChoice) {
		// if the selected square is a king already, better name would be alreadyKing
		var becomeKing = SELECTED_SQUARE.isKing;

		// Jump dude
		for (var i = 0; i < square.matados.length; i++) {
			var matado = square.matados[i];
			jump(matado);
			becomeKing = becomeKing || becomeKingAfterJump(matado.y);
		}

		// set new props for the square already moved to have props of the selected square
		// already moved to the square (to be moved) position.
		square.player = SELECTED_SQUARE.player;
		square.isKing = becomeKing || isKing(square);
		// remove the details from the previous square, that is the square that it moved from.
		SELECTED_SQUARE.player = null;
		SELECTED_SQUARE.isKing = false;
		//switch player turns after moving
		CHECKER_CTX.player = CHECKER_CTX.player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
	}
};

// if the square in question contains a checker at the opponent end, then crown the checker.
const isKing = square => {
	if (CHECKER_CTX.player === PLAYER_ONE) {
		if (square.y === 0) return true;
	} else {
		if (square.y === BOARD_WIDTH - 1) return true;
	}
	return false;
};

//this function ascetains the position of the checkers and the player(color) to
// verify if there is a possibility for coronation for your next step based on the previous step
const becomeKingAfterJump = y => {
	return (CHECKER_CTX.player === PLAYER_ONE && y == 1) || (CHECKER_CTX.player === PLAYER_TWO && y == BOARD_WIDTH - 2);
};

/**
 *
 * @param {*} jumped
 *  the matado/killed square gets set to having a null checker. basically no checker because it has been jumped
 *  the jumper gets a increase in score, the jumped  nothing.
 *  if either have a cumulative score of 8 then, ladies and gentlemen we have a winner.
 *  else it ends in a stalemate
 *
 */

const jump = jumped => {
	jumped.player = null;
	jumped.isKing = false;
	if (CHECKER_CTX.player === PLAYER_ONE) {
		CHECKER_CTX.player_one_score++;
		if (CHECKER_CTX.player_one_score === BOARD_WIDTH) {
			$timeout(function() {
				gameOver(PLAYER_ONE);
			}, 50);
		}
	} else {
		CHECKER_CTX.player_two_score++;
		if (CHECKER_CTX.player_two_score === BOARD_WIDTH) {
			$timeout(function() {
				gameOver(PLAYER_TWO);
			}, 50);
		}
	}
};

const setChoices = (x, y, depth, matados, oldX, oldY, isKing) => {
	if (depth > 10) return;
	isKing =
		isKing ||
		(CHECKER_CTX.player === PLAYER_ONE && y == 0) ||
		(CHECKER_CTX.player === PLAYER_TWO && y == BOARD_WIDTH - 1);
	// Upper Choices
	if (CHECKER_CTX.player === PLAYER_ONE || isKing) {
		// Upper Left
		if (x > 0 && y > 0) {
			var UP_LEFT = CHECKER_CTX.board[y - 1][x - 1];
			if (UP_LEFT.player) {
				if (UP_LEFT.player !== CHECKER_CTX.player) {
					//&& !(x - 2 === oldX && y - 2 === oldY)
					if (x > 1 && y > 1) {
						var UP_LEFT_2 = CHECKER_CTX.board[y - 2][x - 2];
						if (!UP_LEFT_2.player) {
							UP_LEFT_2.isChoice = true;
							var jumpers = matados.slice(0);
							if (jumpers.indexOf(UP_LEFT) === -1) jumpers.push(UP_LEFT);
							UP_LEFT_2.matados = jumpers;
							setChoices(x - 2, y - 2, depth + 1, jumpers, x, y, isKing);
						}
					}
				}
			} else if (depth === 1) {
				UP_LEFT.isChoice = true;
			}
		}

		// Upper Right
		if (x < BOARD_WIDTH - 1 && y > 0) {
			var UP_RIGHT = CHECKER_CTX.board[y - 1][x + 1];
			if (UP_RIGHT.player) {
				if (UP_RIGHT.player !== CHECKER_CTX.player) {
					//  && !(x + 2 === oldX && y - 2 === oldY)
					if (x < BOARD_WIDTH - 2 && y > 1) {
						var UP_RIGHT_2 = CHECKER_CTX.board[y - 2][x + 2];
						if (!UP_RIGHT_2.player) {
							UP_RIGHT_2.isChoice = true;
							var jumpers = matados.slice(0);
							if (jumpers.indexOf(UP_RIGHT) === -1) jumpers.push(UP_RIGHT);
							UP_RIGHT_2.matados = jumpers;
							setChoices(x + 2, y - 2, depth + 1, jumpers, x, y, isKing);
						}
					}
				}
			} else if (depth === 1) {
				UP_RIGHT.isChoice = true;
			}
		}
	}

	// Lower Choices
	if (CHECKER_CTX.player === PLAYER_TWO || isKing) {
		// Lower Left
		if (x > 0 && y < BOARD_WIDTH - 1) {
			var LOWER_LEFT = CHECKER_CTX.board[y + 1][x - 1];
			if (LOWER_LEFT.player) {
				if (LOWER_LEFT.player !== CHECKER_CTX.player) {
					//  && !(x - 2 === oldX && y + 2 === oldY)
					if (x > 1 && y < BOARD_WIDTH - 2) {
						var LOWER_LEFT_2 = CHECKER_CTX.board[y + 2][x - 2];
						if (!LOWER_LEFT_2.player) {
							LOWER_LEFT_2.isChoice = true;
							var jumpers = matados.slice(0);
							if (jumpers.indexOf(LOWER_LEFT) === -1) jumpers.push(LOWER_LEFT);
							LOWER_LEFT_2.matados = jumpers;
							setChoices(x - 2, y + 2, depth + 1, jumpers, x, y, isKing);
						}
					}
				}
			} else if (depth === 1) {
				LOWER_LEFT.isChoice = true;
			}
		}

		// Lower Right
		if (x < BOARD_WIDTH - 1 && y < BOARD_WIDTH - 1) {
			var LOWER_RIGHT = CHECKER_CTX.board[y + 1][x + 1];
			if (LOWER_RIGHT.player) {
				if (LOWER_RIGHT.player !== CHECKER_CTX.player) {
					// && !(x + 2 === oldX && y + 2 === oldY)
					if (x < BOARD_WIDTH - 2 && y < BOARD_WIDTH - 2) {
						var LOWER_RIGHT_2 = CHECKER_CTX.board[y + 2][x + 2];
						if (!LOWER_RIGHT_2.player) {
							LOWER_RIGHT_2.isChoice = true;
							var jumpers = matados.slice(0);
							if (jumpers.indexOf(LOWER_RIGHT) === -1) jumpers.push(LOWER_RIGHT);
							LOWER_RIGHT_2.matados = jumpers;
							setChoices(x + 2, y + 2, depth + 1, jumpers, x, y, isKing);
						}
					}
				}
			} else if (depth === 1) {
				LOWER_RIGHT.isChoice = true;
			}
		}
	}
};

/**
 *
 * @param {*} player
 * player with the highest score wins else stalemate.
 */
const gameOver = player => {
	if (player) {
		alert(player + ' wins!');
	} else {
		alert('Stalemate');
	}
};
