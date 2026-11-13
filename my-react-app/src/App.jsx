import { useState } from 'react'



function CreateGames() {
  const games = new Map();
  for (const i of teams) {
    games.set(i, []);
    for (const j of teams) {
      if (i != j && !draw.has(j))
      {
        games.get(i).push(j);
      }
    }
    if (games.get(i).length == 0) {
      games.delete(i);
    }
  }
  return games;
}

// Generates List of teams
function Group(){
  const teams = ['Meow', 'Woof', 'Moo', 'Roar'  ]
  return (
    <>
      <ul className = "group-games"
      >
        {teams.map((team, index) => (
          <li 
          key={team} 
          className="games-item"
          draggable="true"
          onDragStart={(e) => e.dataTransfer.setData('text/plain', team)}
          >
            {team}
          </li>
        ))}
      </ul>
    </>
  )
}

// Generates Table
function Table(){
  const [value, setValue] = useState(null)
  const c = 4;
  const r = 10;
  return (
    <>
      <table>
        <tbody>
          {Array.from({length: r }, (_,i) =>  (
            <tr key={i}>
              {Array.from({length: c }, (_, j) => (
                <td 
                  key={j}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const team = e.dataTransfer.getData('text/plain')
                    console.log('Dropped', team, 'on row', i, 'column', j)
                    setValue({team, row: i, col: j});
                  }}
                >
                  {i === 0 && j ===0 ? "Time" : ""}
                  {value && value.row == i && value.col === j ? value.team : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// Renders Webpage
export default function Draw() {
  return (
    <>
      <header><h1>Draw Organizer</h1></header>
        
      <main>
        <section>
          <Group />
        </section>
        <section>
          <Table />
        </section>

      </main>
    </>
  )
}