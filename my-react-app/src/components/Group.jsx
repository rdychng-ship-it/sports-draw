import { DRAG_TYPE } from '../utils/groups';

/**
 * Renders one group's games that haven't been placed in the table yet.
 *
 * @param {Object} props
 * @param {{ id: string, name: string }} props.group - The group to list games for
 * @param {Object<string, { id: string, groupId: string, label: string, color: string }>} props.gamesById
 *   Display-ready games keyed by id
 * @param {(string|null)[][]} props.cells - The schedule grid of game ids, used to hide placed games
 * @returns {JSX.Element} The group's heading and a list of draggable, colour-coded games
 */
export default function Group({ group, gamesById, cells }) {
  // Games already in the table are hidden from the list
  const placed = new Set(cells.flat());
  const games = Object.values(gamesById).filter(
    (game) => game.groupId === group.id && !placed.has(game.id)
  );

  return (
    <div>
      <h2>Group {group.name}</h2>
      <ul className="group-games">
        {games.map((game) => (
          <li
            key={game.id}
            className="games-item"
            style={{ backgroundColor: game.color }}
            draggable="true"
            onDragStart={(e) =>
              // Same shape as Table sends; null origin means "from the list"
              e.dataTransfer.setData(
                DRAG_TYPE,
                JSON.stringify({ dropped: game.id, r_origin: null, c_origin: null })
              )
            }
          >
            {game.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
