import { ref } from "@unisonjs/vue";
import "./App.css";

function TodoItem(props: { todo: { id: number; text: string } }) {
  return <li>{props.todo.text}</li>;
}

function App() {
  const groceryList = ref([
    { id: 0, text: "Vegetables" },
    { id: 1, text: "Cheese" },
    { id: 2, text: "Whatever else humans are supposed to eat" },
  ]);

  return (
    <ol>
      {groceryList.value.map((item) => (
        <TodoItem key={item.id} todo={item} />
      ))}
    </ol>
  );
}

export default App;
