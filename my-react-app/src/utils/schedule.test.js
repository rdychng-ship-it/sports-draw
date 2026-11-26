import { describe, it, expect } from 'vitest';
import { applyDrop, hasClash } from './schedule';
import { buildGameLookup } from './groups';
import { resizeGrid } from './grid';

const teams = ['meow', 'woof', 'moo', 'roar', 'iron', 'bronze'].map((id) => ({ id, name: id }));
const groups = [
  { id: 'g1', name: 'A', color: 'red', teamsID: ['meow', 'woof', 'moo', 'roar'] },
  { id: 'g2', name: 'B', color: 'blue', teamsID: ['iron', 'bronze'] },
];
const gamesById = buildGameLookup(groups, teams);

// Game ids used in the tests
const MEOW_WOOF = 'g1-meow-woof';
const MEOW_MOO = 'g1-meow-moo';
const MEOW_ROAR = 'g1-meow-roar';
const WOOF_MOO = 'g1-woof-moo';
const MOO_ROAR = 'g1-moo-roar';
const IRON_BRONZE = 'g2-iron-bronze';

const emptyGrid = () => resizeGrid([], 4, 4);

/** Places games from the list one after another, failing the test if any is refused. */
function place(grid, ...drops) {
  return drops.reduce((g, [row, col, id]) => {
    const next = applyDrop(g, gamesById, row, col, id, null, null);
    if (!next) throw new Error(`setup drop of ${id} was refused`);
    return next;
  }, grid);
}

describe('hasClash', () => {
  it('is false for an empty cell', () => {
    expect(hasClash(emptyGrid(), gamesById, 1, 1)).toBe(false);
  });

  it('is true when a team plays twice in the same row', () => {
    const grid = emptyGrid();
    grid[1][1] = MEOW_WOOF;
    grid[1][2] = MEOW_MOO;
    expect(hasClash(grid, gamesById, 1, 1)).toBe(true);
  });

  it('is false when games in the same row share no teams', () => {
    const grid = emptyGrid();
    grid[1][1] = MEOW_WOOF;
    grid[1][2] = MOO_ROAR;
    expect(hasClash(grid, gamesById, 1, 1)).toBe(false);
  });

  it('ignores games in other rows', () => {
    const grid = emptyGrid();
    grid[1][1] = MEOW_WOOF;
    grid[2][1] = MEOW_MOO;
    expect(hasClash(grid, gamesById, 1, 1)).toBe(false);
  });
});

describe('applyDrop: placing from the list', () => {
  it('places a game in an empty cell', () => {
    const grid = applyDrop(emptyGrid(), gamesById, 1, 1, MEOW_WOOF, null, null);
    expect(grid[1][1]).toBe(MEOW_WOOF);
  });

  it('refuses drops onto the court and time labels', () => {
    expect(applyDrop(emptyGrid(), gamesById, 0, 1, MEOW_WOOF, null, null)).toBeNull();
    expect(applyDrop(emptyGrid(), gamesById, 1, 0, MEOW_WOOF, null, null)).toBeNull();
  });

  it('refuses a game whose team already plays in that time slot', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    expect(applyDrop(grid, gamesById, 1, 2, MEOW_MOO, null, null)).toBeNull();
  });

  it('allows the same team in a different time slot', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    expect(applyDrop(grid, gamesById, 2, 1, MEOW_MOO, null, null)).not.toBeNull();
  });

  it('allows games from another group in the same time slot', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    expect(applyDrop(grid, gamesById, 1, 2, IRON_BRONZE, null, null)).not.toBeNull();
  });

  it('replaces the game in a filled cell', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    const next = applyDrop(grid, gamesById, 1, 1, IRON_BRONZE, null, null);
    expect(next[1][1]).toBe(IRON_BRONZE);
    expect(next.flat()).not.toContain(MEOW_WOOF); // goes back to the list
  });

  it('does not change the original grid', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    applyDrop(grid, gamesById, 2, 2, IRON_BRONZE, null, null);
    expect(grid[2][2]).toBeNull();
  });
});

describe('applyDrop: moving between cells', () => {
  it('moves a game and empties its old cell', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    const next = applyDrop(grid, gamesById, 2, 2, MEOW_WOOF, 1, 1);
    expect(next[2][2]).toBe(MEOW_WOOF);
    expect(next[1][1]).toBeNull();
  });

  it('allows moving within the same time slot (no clash with itself)', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    const next = applyDrop(grid, gamesById, 1, 2, MEOW_WOOF, 1, 1);
    expect(next[1][2]).toBe(MEOW_WOOF);
    expect(next[1][1]).toBeNull();
  });

  it('leaves the game in place when dropped on its own cell', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF]);
    expect(applyDrop(grid, gamesById, 1, 1, MEOW_WOOF, 1, 1)[1][1]).toBe(MEOW_WOOF);
  });

  it('swaps two games when neither ends up clashing', () => {
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF], [2, 1, IRON_BRONZE]);
    const next = applyDrop(grid, gamesById, 2, 1, MEOW_WOOF, 1, 1);
    expect(next[2][1]).toBe(MEOW_WOOF);
    expect(next[1][1]).toBe(IRON_BRONZE);
  });

  it('refuses a swap where the dragged game clashes in its new slot', () => {
    // Row 1: Meow v Woof, Moo v Roar.  Row 2: Woof v Moo
    const grid = place(emptyGrid(), [1, 1, MEOW_WOOF], [1, 2, MOO_ROAR], [2, 1, WOOF_MOO]);
    // Woof v Moo onto Moo v Roar → Woof would play twice in row 1
    expect(applyDrop(grid, gamesById, 1, 2, WOOF_MOO, 2, 1)).toBeNull();
  });

  it('refuses a swap where the returning game clashes in the old slot', () => {
    // Row 1: Iron v Bronze, Moo v Roar.  Row 2: Meow v Roar
    const grid = place(emptyGrid(), [1, 1, IRON_BRONZE], [1, 2, MOO_ROAR], [2, 1, MEOW_ROAR]);
    // Iron v Bronze onto Meow v Roar → Meow v Roar returns to row 1, where Roar already plays
    expect(applyDrop(grid, gamesById, 2, 1, IRON_BRONZE, 1, 1)).toBeNull();
  });
});
