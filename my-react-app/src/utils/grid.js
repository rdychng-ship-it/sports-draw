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
