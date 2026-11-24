import { useState } from 'react';
import Group from './components/Group';
import Table from './components/Table';
import UserInputs from './components/UserInputs';
import { resizeGrid } from './utils/grid';

const START_COURTS = 3;
const ROWS = 10; // 1 header row + 9 time slots

/**
 * Root component for the Draw Organiser.
 * Holds the schedule state and passes it to the game list and the table.
 *
 * @returns {JSX.Element} The page header, court input, list of unplaced games and schedule table
 */
export default function Draw() {

  const groups = [
    {name: 'A', teams: ['Meow', 'Woof', 'Moo', 'Roar'], color: 'red'},
    {name:'B', teams: ['Iron', 'Bronze', 'Silver', 'Copper'], color: 'blue'}
  ]

  const [courts, setCourts] = useState(START_COURTS);

  // Schedule grid: cells[row][col] holds a game string, or null if empty.
  // +1 column for the time labels.
  const [cells, setCells] = useState(() => resizeGrid([], ROWS, START_COURTS + 1));

  function handleCourtsChange(n) {
    setCourts(n);
    setCells((prev) => resizeGrid(prev, ROWS, n + 1));
  }

  /**
   * Places a game in a cell. If it came from another cell, that cell gets
   * whatever was in the target (so occupied cells swap).
   *
   * @param {number} row - Target row
   * @param {number} col - Target column
   * @param {string} team - The game being dropped, e.g. "Meow vs Woof"
   * @param {number|null} r_origin - Row it came from, or null if dragged from the list
   * @param {number|null} c_origin - Column it came from, or null if dragged from the list
   */
  function handleDrop(row, col, team, r_origin, c_origin) {
    if (row === 0 || col === 0) return; // never drop onto the labels

    setCells((prev) => {
      const replaced = prev[row][col]; // what was in the target before the drop

      return prev.map((rowArr, i) =>
        rowArr.map((cell, j) =>
          i === row && j === col             ? team      // the target gets the dragged game
          : i === r_origin && j === c_origin ? replaced  // the origin gets the old target value
          : cell                                         // every other cell stays the same
        )
      );
    });
  }

  return (
    <>
      <header><h1>Draw Organizer</h1></header>

      <main>
        <section>
        <UserInputs courts={courts} onCourtsChange={handleCourtsChange} />

        {groups.map((group) => (
          <Group key={group.name} group={group} cells={cells} />
        ))}
        </section>
        <section>
          <Table cells={cells} groups={groups} onTeamDrop={handleDrop} />
        </section>
      </main>
    </>
  );
}
