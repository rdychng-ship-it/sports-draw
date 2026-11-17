// Shared drag-and-drop format label, used by Group (drag from list) and Table (drag between cells).
// A custom label means text dragged in from outside the page is ignored.
export const DRAG_TYPE = 'application/x-draw-game';

/**
 * Builds every unique pairing of teams once (round robin).
 *
 * @param {string[]} teams - The team names
 * @returns {string[]} Games such as "Meow vs Woof"
 */
export function createGames(teams) {
  const games = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      games.push(`${teams[i]} vs ${teams[j]}`);
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
