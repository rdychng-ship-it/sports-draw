import { createGames, DRAG_TYPE } from '../utils/grid';

/**
 * Renders the list of games that can be dragged into the table.
 *
 * @param {Object} props
 * @param {string[]} props.teams - The team names
 * @param {(string|null)[][]} props.cells - The schedule grid
 * @returns {JSX.Element} A list of draggable games that haven't been placed in the table yet
 */
export default function Group({ teams, cells }) {
  // Games already in the table are hidden from the list
  const placed = new Set(cells.flat());
  const games = createGames(teams).filter((game) => !placed.has(game));

  return (
    <ul className="group-games">
      {games.map((game) => (
        <li
          key={game}
          className="games-item"
          draggable="true"
          onDragStart={(e) =>
            // Same shape as Table sends; null origin means "from the list"
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
  );
}
