import { ref } from "@unisonjs/vue";
import { cells, evalCell } from "./store.js";


function Cell(props) {
  const editing = ref(false);

  function update(e) {
    cells[props.c][props.r] = e.target.value.trim();
  }

  function confirm(e) {
    if (e.key === "Enter") editing.value = false;
  }

  return (
    <div
      className="h-6 leading-6 text-[15px] border border-gray-300 px-1"
      title={cells[props.c][props.r]}
      onClick={() => (editing.value = true)}
    >
      {editing.value ? (
        <input
          className="w-full box-border"
          defaultValue={cells[props.c][props.r]}
          autoFocus
          onKeyUp={confirm}
          onChange={update}
          onBlur={() => (editing.value = false)}
        />
      ) : (
        <span className="px-1">{evalCell(cells[props.c][props.r])}</span>
      )}
    </div>
  );
}

function App() {
  const cols = cells.map((_, i) => String.fromCharCode(65 + i));

  return (
    <table className="border-collapse table-fixed w-full">
      <thead>
        <tr>
          <th className="bg-gray-200 w-6"></th>
          {cols.map((c) => (
            <th key={c} className="bg-gray-200 w-24">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: cells[0].length }, (_, i) => (
          <tr key={i}>
            <th className="bg-gray-200 w-6">{i}</th>
            {cols.map((_, j) => (
              <td key={j} className="border border-gray-300">
                <Cell r={i} c={j} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
