import { ref } from "@unisonjs/vue";

function App() {
  const message = ref("Hello World!");
  const isRed = ref(true);
  const color = ref("green");

  function toggleRed() {
    isRed.value = !isRed.value;
  }

  function toggleColor() {
    color.value = color.value === "green" ? "blue" : "green";
  }
  return (
    <>
      <p>
        <span title={message.value}>
          Hover your mouse over me for a few seconds to see my dynamically bound
          title!
        </span>
      </p>
      <p className={isRed.value ? "red" : undefined} onClick={toggleRed}>
        This should be red... but click me to toggle it.
      </p>

      <p style={{ color: color.value }} onClick={toggleColor}>
        This should be green, and should toggle between green and blue on click.
      </p>
    </>
  );
}


export default App
