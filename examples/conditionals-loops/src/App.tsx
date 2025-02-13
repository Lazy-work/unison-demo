import { ref, $if } from "@unisonjs/vue";
import "./App.css";

function App() {
  const show = ref(true);
  const list = ref([1, 2, 3]);

  return (
    <>
      <button onClick={() => (show.value = !show.value)}>Toggle List</button>
      <button onClick={() => list.value.push(list.value.length + 1)}>
        Push Number
      </button>
      <button onClick={() => list.value.pop()}>Pop Number</button>
      <button onClick={() => list.value.reverse()}>Reverse List</button>

      {$if(show.value && list.value.length)
        .then(
          <ul>
            {$for(list).each((item) => (
              <li>{item}</li>
            ))}
          </ul>
        )
        .elseif(list.value.length, <p>List is not empty, but hidden.</p>)
        .else(<p>List is empty.</p>)
        .end()}
    </>
  );
}

export default App;
