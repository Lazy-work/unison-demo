import { ref } from "@unisonjs/vue";

function App() {
  const message = ref("Hello World!");

  function reverseMessage() {
    // Access/mutate the value of a ref via
    // its .value property.
    message.value = message.value.split("").reverse().join("");
  }

  function notify(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    alert("navigation was prevented.");
  }
  return (
    <>
      <h1>{message.value}</h1>
      <button onClick={reverseMessage}>Reverse Message</button>
      <button onClick={() => (message.value += "!")}>Append "!"</button>
      <a href="https://vuejs.org" onClick={notify}>
        A link with e.preventDefault()
      </a>
    </>
  );
}

export default App;
