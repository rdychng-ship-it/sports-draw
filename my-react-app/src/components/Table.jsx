import { DRAG_TYPE } from '../utils/groups';

/**
 * Renders the schedule table.
 *
 * @param {Object} props
 * @param {(string|null)[][]} props.cells - The schedule grid of game ids
 * @param {Object<string, { id: string, label: string, color: string }>} props.gamesById
 *   Display-ready games keyed by id, used for each cell's label and colour
 * @param {(row: number, col: number, gameId: string, r_origin: number|null, c_origin: number|null) => void} props.onTeamDrop
 *   Called when a game is dropped on a cell
 * @returns {JSX.Element} The schedule table with court and time labels, where games can be dropped, moved and colour-coded by group
 */
export default function Table({ cells, gamesById, onTeamDrop }) {
  const time = 8;

  return (
    <table>
      <tbody>
        {cells.map((row, i) => (
          <tr key={i}>
            {row.map((gameId, j) => {
              const isLabel = i === 0 || j === 0;
              const game = !isLabel && gameId ? gamesById[gameId] : undefined;

              return (
                <td
                  key={j}
                  className={game ? 'game-cell' : undefined}
                  style={game ? { backgroundColor: game.color } : undefined}
                  // Only cells holding a game can be dragged
                  draggable={!isLabel && gameId !== null}
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      DRAG_TYPE,
                      JSON.stringify({ dropped: gameId, r_origin: i, c_origin: j })
                    )
                  }
                  // Allow drops only on game cells, and only for our own drag data
                  onDragOver={(e) => {
                    if (!isLabel && e.dataTransfer.types.includes(DRAG_TYPE)) {
                      e.preventDefault();
                    }
                  }}
                  onDrop={(e) => {
                    const raw = e.dataTransfer.getData(DRAG_TYPE);
                    if (!raw) return; // not our data
                    const data = JSON.parse(raw);
                    onTeamDrop(i, j, data.dropped, data.r_origin, data.c_origin);
                  }}
                >
                  {i === 0 && j === 0 ? 'Time'
                    : i === 0 ? `Court ${j}`
                    : j === 0 ? `${time + i}:00`
                    : game?.label ?? ''}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
