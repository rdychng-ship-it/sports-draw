/**
 * Checks whether the game in a cell shares a team with another game in the same row (time slot).
 *
 * @example
 * // Row 2 holds "Meow vs Woof" in column 1 and "Meow vs Moo" in column 2
 * hasClash(grid, gamesById, 2, 1) // → true
 *
 * @param {(string|null)[][]} grid - Schedule grid of game ids
 * @param {Object<string, { teamA: string, teamB: string }>} gamesById - Games keyed by id
 * @param {number} row - Row of the cell to check
 * @param {number} col - Column of the cell to check
 * @returns {boolean} True if a team in that cell's game also plays elsewhere in the same row
 */
export function hasClash(grid, gamesById, row, col) {
  const game = gamesById[grid[row][col]];
  if (!game) return false; // empty cell or unknown game

  const teams = [game.teamA, game.teamB];

  return grid[row].some((otherId, j) => {
    if (j === 0 || j === col || !otherId) return false; // skip the time label, the cell itself and empty cells
    const other = gamesById[otherId];
    return other && (teams.includes(other.teamA) || teams.includes(other.teamB));
  });
}

/**
 * Works out the grid after a drop, or returns null if the drop isn't allowed.
 * Moving onto an occupied cell swaps the two games. The drop is refused if it targets
 * a label cell, or if either game would end up in a time slot where one of its teams already plays.
 *
 * @param {(string|null)[][]} grid - Current schedule grid of game ids
 * @param {Object<string, { teamA: string, teamB: string }>} gamesById - Games keyed by id
 * @param {number} row - Target row
 * @param {number} col - Target column
 * @param {string} gameId - Id of the game being dropped
 * @param {number|null} r_origin - Row it came from, or null if dragged from the list
 * @param {number|null} c_origin - Column it came from, or null if dragged from the list
 * @returns {(string|null)[][] | null} The new grid, or null if the drop is not allowed
 */
export function applyDrop(grid, gamesById, row, col, gameId, r_origin, c_origin) {
  if (row === 0 || col === 0) return null; // never drop onto the labels

  const replaced = grid[row][col]; // what was in the target before the drop

  const next = grid.map((rowArr, i) =>
    rowArr.map((cell, j) =>
      i === row && j === col             ? gameId    // the target gets the dragged game
      : i === r_origin && j === c_origin ? replaced  // the origin gets the old target value
      : cell                                         // every other cell stays the same
    )
  );

  // Check the new grid, so cells that moved are already in their new places.
  // For a swap, the game sent back to the origin is checked too.
  const fromCell = r_origin !== null && c_origin !== null;
  if (hasClash(next, gamesById, row, col)) return null;
  if (fromCell && hasClash(next, gamesById, r_origin, c_origin)) return null;

  return next;
}
