import { DRAG_TYPE, findGroup } from '../utils/grid';

/**
 * Renders the schedule table.
 *
 * @param {Object} props
 * @param {(string|null)[][]} props.cells - The schedule grid
 * @param {{ name: string, teams: string[], color: string }[]} props.groups - All groups, used to colour each game cell by its group
 * @param {(row: number, col: number, game: string, r_origin: number|null, c_origin: number|null) => void} props.onTeamDrop
 *   Called when a game is dropped on a cell
 * @returns {JSX.Element} The schedule table with court and time labels, where games can be dropped, moved and colour-coded by group
 */
export default function Table({ cells, groups, onTeamDrop }) {
  const time = 8;

  return (
    <table>
      <tbody>
        {cells.map((row, i) => (
          <tr key={i}>
            {row.map((team, j) => {
              const isLabel = i === 0 || j === 0;
              const group = !isLabel && team ? findGroup(groups, team): undefined
              return (
                <td
                  key={j}
                  className={group ? 'game-cell' : undefined}
                  style={group ? {backgroundColor: group.color} : undefined}
                  draggable={!isLabel && team !== null}
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      DRAG_TYPE,
                      JSON.stringify({ dropped: team, r_origin: i, c_origin: j })
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
                    : team}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
