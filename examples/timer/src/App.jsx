import { ref, computed, onUnmounted, watchPostEffect } from "@unisonjs/vue";

function App() {
  const duration = ref(15 * 1000);
  const elapsed = ref(0);
  let lastTime;
  let handle;

  const update = () => {
    elapsed.value = performance.now() - lastTime;
    if (elapsed.value >= duration.value) {
      cancelAnimationFrame(handle);
    } else {
      handle = requestAnimationFrame(update);
    }
  };

  const reset = () => {
    elapsed.value = 0;
    lastTime = performance.now();
    update();
  };

  const progressRate = computed(() =>
    Math.min(elapsed.value / duration.value, 1)
  );
  
  reset();

  onUnmounted(() => {
    cancelAnimationFrame(handle);
  });

  return (
    <div className="w-72">
      <label className="block">
        Elapsed Time:{" "}
        <progress
          className="w-full"
          value={progressRate.value}
          max="1"
        ></progress>
      </label>

      <div className="mt-2">{(elapsed.value / 1000).toFixed(1)}s</div>

      <div className="mt-2">
        Duration:
        <input
          className="w-full mt-1"
          type="range"
          value={duration.value}
          min="1"
          max="30000"
          onInput={(e) => (duration.value = e.target.value)}
        />
        {(duration.value / 1000).toFixed(1)}s
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
