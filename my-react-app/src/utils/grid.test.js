import { describe, it, expect } from 'vitest';
import { resizeGrid } from './grid';

describe('resizeGrid', () => {
  it('creates an empty grid of the given size', () => {
    const grid = resizeGrid([], 3, 4);
    expect(grid).toHaveLength(3);
    expect(grid.every((row) => row.length === 4)).toBe(true);
    expect(grid.flat().every((cell) => cell === null)).toBe(true);
  });

  it('keeps existing values when growing', () => {
    const grid = resizeGrid([[null, 'a'], [null, 'b']], 3, 3);
    expect(grid[0][1]).toBe('a');
    expect(grid[1][1]).toBe('b');
    expect(grid[2][2]).toBeNull(); // new cells are empty
  });

  it('drops values that no longer fit when shrinking', () => {
    const grid = resizeGrid([[null, 'a', 'b'], [null, 'c', 'd']], 2, 2);
    expect(grid).toEqual([[null, 'a'], [null, 'c']]);
  });

  it('returns a new grid instead of changing the old one', () => {
    const old = [[null, 'a']];
    const grid = resizeGrid(old, 1, 2);
    expect(grid).not.toBe(old);
    expect(old).toEqual([[null, 'a']]); // original untouched
  });
});
