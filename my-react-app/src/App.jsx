import { useState } from 'react'



function createGames(teams) {
  const games = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      games.push(`${teams[i]} vs ${teams[j]}`);
    }
  }
  return games;
}

// Generates List of teams
function Group({ teams, cells }) {
  const placed = new Set(cells.flat());
  const games = createGames(teams).filter((game) => !placed.has(game));

  return (
    <ul className="group-games">
      {games.map((game) => (
        <li
          key={game}
          className="games-item"
          draggable="true"
          onDragStart={(e) => e.dataTransfer.setData('text/plain', game)}
        >
          {game}
        </li>
      ))}
    </ul>
  );
}

// Generates Table
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
                onDragOver={(e) => { if (i !== 0 && j !== 0) e.preventDefault(); }}
                onDrop={(e) => {
                  const dropped = e.dataTransfer.getData('text/plain');
                  onTeamDrop(i, j, dropped);
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


export default function Draw() {
  const c = 4;
  const r = 10;
  const teams = ['Meow', 'Woof', 'Moo', 'Roar'];

  // An 2d Array
  const [cells, setCells] = useState(
    () => Array.from({ length: r }, () => Array(c).fill(null))
  );

  function handleDrop(row, col, team) {
    setCells(prev =>
      prev.map((rowArr, i) =>
        i === row ? rowArr.map((cell, j) => (j === col ? team : cell)) 
          : rowArr
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