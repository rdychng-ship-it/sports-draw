// Shared drag-and-drop format label, used by Group (drag from list) and Table (drag between cells).
// A custom label means text dragged in from outside the page is ignored.
export const DRAG_TYPE = 'application/x-draw-game';

/**
 * Builds every unique pairing of teams in one group (round robin).
 *
 * @example
 * createGames(['meow', 'woof'], 'g1') // → [{ id: 'g1-meow-woof', groupId: 'g1', teamA: 'meow', teamB: 'woof' }]
 *
 * @param {string[]} teamIds - Ids of the teams in the group
 * @param {string} groupId - Id of the group the teams belong to
 * @returns {{ id: string, groupId: string, teamA: string, teamB: string }[]} One game per pair of teams
 */
export function createGames(teamIds, groupId) {
  const games = [];
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      games.push({
        // Built from the group and team ids, so the same game always gets the same id
        id: `${groupId}-${teamIds[i]}-${teamIds[j]}`,
        groupId,
        teamA: teamIds[i],
        teamB: teamIds[j],
      });
    }
  }
  return games;
}

/**
 * Builds a lookup of every game, keyed by game id, with everything needed to display it.
 *
 * @example
 * const gamesById = buildGameLookup(groups, teams);
 * gamesById['g1-meow-woof'] // → { id, groupId: 'g1', teamA, teamB, label: 'Meow vs Woof', color: 'red' }
 *
 * @param {{ id: string, name: string, color: string, teamsID: string[] }[]} groups - All groups
 * @param {{ id: string, name: string }[]} teams - All teams
 * @returns {Object<string, { id: string, groupId: string, teamA: string, teamB: string, label: string, color: string }>}
 *   Display-ready games keyed by id
 */
export function buildGameLookup(groups, teams) {
  // Team id → team, so names can be found without searching
  const teamsById = Object.fromEntries(teams.map((team) => [team.id, team]));
  const name = (id) => teamsById[id]?.name ?? 'Unknown';

  const lookup = {};
  for (const group of groups) {
    for (const game of createGames(group.teamsID, group.id)) {
      lookup[game.id] = {
        ...game,
        label: `${name(game.teamA)} vs ${name(game.teamB)}`,
        color: group.color,
      };
    }
  }
  return lookup;
}
