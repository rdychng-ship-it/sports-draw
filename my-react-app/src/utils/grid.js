// Shared drag-and-drop format label, used by Group (drag from list) and Table (drag between cells).
// A custom label means text dragged in from outside the page is ignored.
export const DRAG_TYPE = 'application/x-draw-game';

/**
 * Gets the group name from the start of a game string.
 *
 * @example
 * getGroupName('A: Meow vs Woof') // → 'A'
 *
 * @param {string} game - A game string in the format "<group>: <team> vs <team>"
 * @returns {string} The group name: everything before the first ": "
 */
export function getGroupName(game) {
  return game.split(': ')[0];
}

/**
 * Finds the group a game belongs to, using the group name at the start of the game string.
 *
 * @example
 * findGroup(groups, 'A: Meow vs Woof') // → { name: 'A', teams: [...], color: 'red' }
 *
 * @param {{ name: string, teams: string[], color: string }[]} groups - All groups
 * @param {string} game - A game string, e.g. "A: Meow vs Woof"
 * @returns {{ name: string, teams: string[], color: string } | undefined} The matching group, or undefined if no group has that name
 */
export function findGroup(groups, game) {
  const name = getGroupName(game);
  return groups.find((group) => group.name === name);
}

/**
 * Builds every unique pairing of teams once (round robin).
 *
 * @param {string[]} teams - The team names
 * @param {string} groupName - The group the teams belong to
 * @returns {string[]} Games such as "Meow vs Woof"
 */
export function createGames(teams, groupName) {
  const games = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      games.push(`${groupName}: ${teams[i]} vs ${teams[j]}`);
    }
  }
  return games;
}

/**
 * Returns a new grid of the given size, keeping any values that still fit.
 *
 * @param {(string|null)[][]} grid - The current grid
 * @param {number} rows - Number of rows in the new grid
 * @param {number} cols - Number of columns in the new grid
 * @returns {(string|null)[][]} The resized grid
 */
export function resizeGrid(grid, rows, cols) {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => grid[i]?.[j] ?? null)
  );
}
