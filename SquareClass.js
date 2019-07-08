/** block/ square  class definition
 * Every square in the checkers game could have or not have one of this
 * 1. a checker in it, in this case could be a PLAYER_ONE or a PLAYER_TWO checker.
 * 2. x and y corresponding to positions on the board.
 * 3. a square/block could contain a king checker or not.
 * 4. a square could be the currently selected or not.
 * 5. square could be a PLAYER_TWO hole that sucks checkers from other squares or blocks.
 */

/**@TODO test  Square returns correct instance */
export default class Square {
	constructor(player, x, y) {
		this.player = player;
		this.x = x;
		this.y = y;
		this.isKing = false;
		this.matados = [];
	}
}
