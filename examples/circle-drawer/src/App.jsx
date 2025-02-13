import { ref, shallowReactive, toRaw } from '@unisonjs/vue';

function App() {
  const history = shallowReactive([[]]);
  const index = ref(0);
  const circles = ref([]);
  const selected = ref(null);
  const adjusting = ref(false);

  function onClick({ clientX: x, clientY: y }) {
    if (adjusting.value) {
      adjusting.value = false;
      selected.value = null;
      push();
      return;
    }

    selected.value = [...circles.value].reverse().find(({ cx, cy, r }) => {
      const dx = cx - x;
      const dy = cy - y;
      return Math.sqrt(dx * dx + dy * dy) <= r;
    });

    if (!selected.value) {
      circles.value.push({ cx: x, cy: y, r: 50 });
      push();
    }
  }

  function adjust(circle) {
    selected.value = circle;
    adjusting.value = true;
  }

  function push() {
    history.length = ++index.value;
    history.push(clone(circles.value));
    console.log(toRaw(history));
  }

  function undo() {
    circles.value = clone(history[--index.value]);
  }

  function redo() {
    circles.value = clone(history[++index.value]);
  }

  function clone(circles) {
    return circles.map((c) => ({ ...c }));
  }

  return (
    <div>
      <svg className="w-screen h-screen bg-gray-200" onClick={onClick}>
        <foreignObject x="0" y="40%" width="100%" height="200">
          <p className="text-center px-12 text-gray-500">
            Click on the canvas to draw a circle. Click on a circle to select it.
            Right-click on the canvas to adjust the radius of the selected circle.
          </p>
        </foreignObject>
        {circles.value.map((circle, i) => (
          <circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill={circle === selected.value ? '#ccc' : '#fff'}
            stroke="#000"
            onClick={() => (selected.value = circle)}
            onContextMenu={(e) => {
              e.preventDefault();
              adjust(circle);
            }}
          />
        ))}
      </svg>

      <div className="fixed top-2 left-0 right-0 text-center">
        <button
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          disabled={index.value <= 0}
          onClick={undo}
        >
          Undo
        </button>
        <button
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          disabled={index.value >= history.length - 1}
          onClick={redo}
        >
          Redo
        </button>
      </div>

      {adjusting.value && selected.value && (
        <div
          className="fixed top-1/2 left-1/2 w-80 h-24 bg-white rounded-lg shadow-lg p-4 text-center"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <p>
            Adjust radius of circle at ({selected.value.cx}, {selected.value.cy})
          </p>
          <input
            className="block w-40 mx-auto"
            type="range"
            min="1"
            max="300"
            value={selected.value.r}
            onInput={(e) => (selected.value.r = e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
