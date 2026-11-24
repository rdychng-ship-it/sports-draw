import { createGames, DRAG_TYPE } from '../utils/grid';

/**
 * Renders one group's games that haven't been placed in the table yet.
 *
 * @param {Object} props
 * @param {{ name: string, teams: string[], color: string }} props.group - The group to list games for
 * @param {(string|null)[][]} props.cells - The schedule grid
 * @returns {JSX.Element} A list of draggable games that haven't been placed in the table yet
 */
export default function Group({group, cells }) {
  const placed = new Set(cells.flat());
  const games = createGames(group.teams, group.name).filter((game) => !placed.has(game));

  return (
    <div>
      <h2>Group {group.name}</h2>
      <ul className="group-games">
        {games.map((game) => (
          <li
            key={game}
            className="games-item"
            style={{ backgroundColor: group.color }}
            draggable="true"
            onDragStart={(e) =>
              e.dataTransfer.setData(
                DRAG_TYPE,
                JSON.stringify({ dropped: game, r_origin: null, c_origin: null })
              )
            }
          >
            {game}
          </li>
        ))}
      </ul>
    </div>
  );
}
