import { useState } from 'react'

/** 
* Generates Games Between Teams
*
* @param {string[]} teams - An array of teams
* @returns {string[]} An array of games
*/
function createGames(teams) {
  const games = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      games.push(`${teams[i]} vs ${teams[j]}`);
    }
  }
  return games;
}

/**
* Renders List of games
*
* @param {string[]} teams - An array of teams
* @param {(string|null)[][]} cells - 2d array for table
 * @returns {JSX.Element} A list of draggable games that haven't been placed in the table yet
*/
function Group({ teams, cells }) {

  // Keeps track of what to generate in list
  const placed = new Set(cells.flat()); 
  const games = createGames(teams).filter((game) => !placed.has(game));

  return (
    <ul className="group-games">
      {games.map((game) => (
        <li
          key={game}
          className="games-item"
          draggable="true"
          onDragStart={(e) => e.dataTransfer.setData('application/x-draw-game', JSON.stringify({dropped: game, r_origin: null, c_origin: null}))}
        >
          {game}
        </li>
      ))}
    </ul>
  );
}

/** 
 * Renders Schedule Table
 * 
 * @param {(string|null[][])} cells - 2d array of the table
 * @param {function} onTeamDrop - function to handle data transfers
*/
function Table({ cells, onTeamDrop }) {
  let time =8;
  return (
    <table>
      <tbody>
        {cells.map((row, i) => (
          <tr key={i}>
            {row.map((team, j) => (
              <td
                key={j}
                draggable= {team === null ? false : true}
                onDragStart={(e) => e.dataTransfer.setData('application/x-draw-game', JSON.stringify({dropped: team, r_origin: i, c_origin: j}))}
                onDragOver={(e) => { if (i !== 0 && j !== 0) e.preventDefault(); }}
                onDrop={(e) => {
                  const data = JSON.parse(e.dataTransfer.getData('application/x-draw-game'))
                  onTeamDrop(i, j, data.dropped, data.r_origin, data.c_origin);
                }}
              >
                {i === 0 && j === 0 ? "Time" 
                  : i===0 ? `Court ${j}`
                  : j === 0 ? `${time + i}:00`
                  :team}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Root component for the Draw Organizer.
 * Holds the schedule state and passes it to the game list and the table.
 *
 * @returns {JSX.Element} The page header, the list of unplaced games, and the schedule table
 */
export default function Draw() {
  // Table size and teams (to be changed to user Inputs)
  const c = 4;
  const r = 10;
  const teams = ['Meow', 'Woof', 'Moo', 'Roar'];

  // Schedule grid: cell[row][col]
  const [cells, setCells] = useState(
    () => Array.from({ length: r }, () => Array(c).fill(null))
  );


  /**
   * Places a game in a cell. If it came from another cell, that cell is emptied.
   *
   * @param {number} row - Target row
   * @param {number} col - Target column
   * @param {string} team - The game being dropped, e.g. "Meow vs Woof"
   * @param {number|null} r_origin - Row it came from, or null if dragged from the list
   * @param {number|null} c_origin - Column it came from, or null if dragged from the list
   */
  function handleDrop(row, col, team, r_origin, c_origin) {
    if (row === 0 || col === 0) return; // never drop onto the labels

    setCells(prev =>
      prev.map((rowArr, i) =>
        rowArr.map((cell, j) =>
          i === row && j === col            ? team // the target cell gets the game
          : i === r_origin && j === c_origin ? prev[row][col]// the origin cell is emptied
          : cell                                     // every other cell stays the same
        )
      )
    );
  }

  // Renders Webpage
  return (
    <>
      <header><h1>Draw Organizer</h1></header>
        
      <main>
        <section>
          <Group teams={teams} cells={cells} />
        </section>
        <section>
          <Table cells={cells} onTeamDrop={handleDrop} />
        </section>

      </main>
    </>
  )
}