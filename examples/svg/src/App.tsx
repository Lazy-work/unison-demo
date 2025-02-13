import { ref, reactive, computed } from "@unisonjs/vue";
import "./App.css";

function valueToPoint(value: number, index: number, total: number) {
  const x = 0;
  const y = -value * 0.8;
  const angle = ((Math.PI * 2) / total) * index;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const tx = x * cos - y * sin + 100;
  const ty = x * sin + y * cos + 100;
  return {
    x: tx,
    y: ty,
  };
}

function AxisLabel(props: {
  stat: { label: string; value: number };
  index: number;
  total: number;
}) {
  const point = computed(() =>
    valueToPoint(+props.stat.value + 10, props.index, props.total)
  );

  return (
    <text x={point.value.x} y={point.value.y}>
      {props.stat.label}
    </text>
  );
}

function PolyGraph(props: { stats: { label: string; value: number }[] }) {
  const points = computed(() => {
    const total = props.stats.length;
    return props.stats
      .map((stat, i) => {
        const { x, y } = valueToPoint(stat.value, i, total);
        return `${x},${y}`;
      })
      .join(" ");
  });

  return (
    <g>
      <polygon points={points.value}></polygon>
      <circle cx="100" cy="100" r="80"></circle>
      {props.stats.map((stat, index) => (
        <AxisLabel
          key={index}
          stat={stat}
          index={index}
          total={props.stats.length}
        />
      ))}
    </g>
  );
}


function App() {
  const newLabel = ref("");
  const stats = reactive([
    { label: "A", value: 100 },
    { label: "B", value: 100 },
    { label: "C", value: 100 },
    { label: "D", value: 100 },
    { label: "E", value: 100 },
    { label: "F", value: 100 },
  ]);

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newLabel.value) return;
    stats.push({
      label: newLabel.value,
      value: 100,
    });
    newLabel.value = "";
  }

  function remove(stat: { label: string; value: number }) {
    if (stats.length > 3) {
      stats.splice(stats.indexOf(stat), 1);
    } else {
      alert("Can't delete more!");
    }
  }

  return (
    <div>
      <svg width="200" height="200">
        <PolyGraph stats={stats} />
      </svg>

      {/* Controls */}
      {stats.map((stat, index) => (
        <div key={index}>
          <label>{stat.label}</label>
          <input
            type="range"
            value={stat.value}
            min="0"
            max="100"
            onInput={(e) => (stat.value = +e.target.value)}
          />
          <span>{stat.value}</span>
          <button onClick={() => remove(stat)} className="remove">
            X
          </button>
        </div>
      ))}

      <form id="add" onSubmit={add}>
        <input
          name="newlabel"
          value={newLabel.value}
          onInput={(e) => (newLabel.value = e.target.value)}
        />
        <button>Add a Stat</button>
      </form>

      <pre id="raw">{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}

export default App;
