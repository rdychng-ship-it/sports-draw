import { describe, it, expect } from 'vitest';
import { createGames, buildGameLookup } from './groups';

const teams = [
  { id: 'meow', name: 'Meow' },
  { id: 'woof', name: 'Woof' },
  { id: 'moo', name: 'Moo' },
  { id: 'roar', name: 'Roar' },
  { id: 'iron', name: 'Iron' },
  { id: 'bronze', name: 'Bronze' },
];
const groups = [
  { id: 'g1', name: 'A', color: 'red', teamsID: ['meow', 'woof', 'moo', 'roar'] },
  { id: 'g2', name: 'B', color: 'blue', teamsID: ['iron', 'bronze'] },
];

describe('createGames', () => {
  it('makes one game for every pair of teams', () => {
    // 4 teams → 4 × 3 / 2 = 6 games
    expect(createGames(['meow', 'woof', 'moo', 'roar'], 'g1')).toHaveLength(6);
  });

  it('never pairs a team with itself', () => {
    const games = createGames(['meow', 'woof', 'moo'], 'g1');
    expect(games.every((game) => game.teamA !== game.teamB)).toBe(true);
  });

  it('gives every game a unique id', () => {
    const games = createGames(['meow', 'woof', 'moo', 'roar'], 'g1');
    const ids = games.map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives the same game the same id every time', () => {
    const first = createGames(['meow', 'woof'], 'g1');
    const second = createGames(['meow', 'woof'], 'g1');
    expect(first[0].id).toBe(second[0].id);
  });

  it('keeps ids from different groups apart', () => {
    const a = createGames(['meow', 'woof'], 'g1');
    const b = createGames(['meow', 'woof'], 'g2');
    expect(a[0].id).not.toBe(b[0].id);
  });

  it('returns no games for fewer than two teams', () => {
    expect(createGames(['meow'], 'g1')).toEqual([]);
    expect(createGames([], 'g1')).toEqual([]);
  });
});

describe('buildGameLookup', () => {
  const gamesById = buildGameLookup(groups, teams);

  it('includes every game from every group', () => {
    // Group A: 6 games, Group B: 1 game
    expect(Object.keys(gamesById)).toHaveLength(7);
  });

  it('keys each game by its own id', () => {
    for (const [key, game] of Object.entries(gamesById)) {
      expect(game.id).toBe(key);
    }
  });

  it('builds a readable label from team names', () => {
    expect(gamesById['g1-meow-woof'].label).toBe('Meow vs Woof');
  });

  it("uses the group's colour and id", () => {
    expect(gamesById['g2-iron-bronze'].color).toBe('blue');
    expect(gamesById['g2-iron-bronze'].groupId).toBe('g2');
  });

  it('shows "Unknown" for a team that does not exist', () => {
    const lookup = buildGameLookup(
      [{ id: 'g1', name: 'A', color: 'red', teamsID: ['meow', 'ghost'] }],
      teams
    );
    expect(lookup['g1-meow-ghost'].label).toBe('Meow vs Unknown');
  });
});
