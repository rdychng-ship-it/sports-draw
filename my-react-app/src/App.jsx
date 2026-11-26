import { useState } from 'react';
import Group from './components/Group';
import Table from './components/Table';
import UserInputs from './components/UserInputs';
import { resizeGrid } from './utils/grid';
import { buildGameLookup } from './utils/groups';
import { applyDrop } from './utils/schedule';

const START_COURTS = 3;
const ROWS = 10; // 1 header row + 9 time slots

/**
 * Root component for the Draw Organiser.
 * Holds the schedule state and passes it to the game list and the table.
 *
 * @returns {JSX.Element} The page header, court input, list of unplaced games and schedule table
 */
export default function Draw() {

  const teams = [
    {id: 'meow', name: 'Meow'},
    {id: 'woof', name: 'Woof'},
    {id: 'moo', name: 'Moo'},
    {id: 'roar', name: 'Roar'},
    {id: 'iron', name: 'Iron'},
    {id: 'bronze', name: 'Bronze'},
    {id: 'silver', name: 'Silver'},
    {id: 'copper', name: 'Copper'}
  ]
  const groups = [
    {id: 'g1', name: 'A', color: 'red', teamsID: ['meow', 'woof', 'moo', 'roar']},
    {id: 'g2', name: 'B', color: 'blue', teamsID: ['iron', 'bronze', 'silver', 'copper']}
  ]

  // Display-ready games keyed by id, rebuilt each render from groups and teams (not state)
  const gamesById = buildGameLookup(groups, teams);

  const [courts, setCourts] = useState(START_COURTS);

  // Schedule grid: cells[row][col] holds a game id, or null if empty.
  // +1 column for the time labels.
  const [cells, setCells] = useState(() => resizeGrid([], ROWS, START_COURTS + 1));

  function handleCourtsChange(n) {
    setCourts(n);
    setCells((prev) => resizeGrid(prev, ROWS, n + 1));
  }

  /**
   * Places a game in a cell, swapping with any game already there.
   * Does nothing if the drop would put a team in two games in the same time slot.
   *
   * @param {number} row - Target row
   * @param {number} col - Target column
   * @param {string} gameId - Id of the game being dropped, e.g. "g1-meow-woof"
   * @param {number|null} r_origin - Row it came from, or null if dragged from the list
   * @param {number|null} c_origin - Column it came from, or null if dragged from the list
   */
  function handleDrop(row, col, gameId, r_origin, c_origin) {
    // applyDrop returns null when the drop isn't allowed; keeping prev means nothing changes
    setCells((prev) => applyDrop(prev, gamesById, row, col, gameId, r_origin, c_origin) ?? prev);
  }

  return (
    <>
      <header><h1>Draw Organizer</h1></header>

      <main>
        <section>
          <UserInputs courts={courts} onCourtsChange={handleCourtsChange} />

          {groups.map((group) => (
            <Group key={group.id} group={group} gamesById={gamesById} cells={cells} />
          ))}
        </section>
        <section>
          <Table cells={cells} gamesById={gamesById} onTeamDrop={handleDrop} />
        </section>
      </main>
    </>
  );
}
