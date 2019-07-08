/**
 * author: Arausi Daniel
 * tests for the checker game
 */

import Square from './SquareClass';
import { createNewGame } from './index';

jest.mock('./SquareClass');

beforeEach(() => {
	// clear all calls to the square class and it's method before any test
	Square.mockClear();

	global.PLAYER_ONE = 'player1';
	global.PLAYER_TWO = 'player2';
	global.BOARD_WIDTH = 8;
	global.SELECTED_SQUARE = null;
});

afterEach(() => {
	jest.clearAllMocks();
});

describe('Checkers Functionality Test', () => {
	test('Should create a 8*8 matrice board', () => {
		const CHECKER_CTX = createNewGame({}, BOARD_WIDTH, PLAYER_ONE, PLAYER_TWO);
		expect(CHECKER_CTX.board.length).toBe(8);
		expect(Square).toHaveBeenCalledTimes(64);
	});
});
