import { ref } from "@unisonjs/vue";
import "./App.css";

function App() {
  const text = ref("Edit me");
  const checked = ref(true);
  const checkedNames = ref(["Jack"]);
  const picked = ref("One");
  const selected = ref("A");
  const multiSelected = ref(["A"]);

  return (
    <div>
      <h2>Text Input</h2>
      <input
        value={text.value}
        onChange={(e) => (text.value = e.target.value)}
      />
      <p>{text.value}</p>

      <h2>Checkbox</h2>
      <input
        type="checkbox"
        id="checkbox"
        checked={checked.value}
        onChange={(e) => (checked.value = e.target.checked)}
      />
      <label htmlFor="checkbox">Checked: {checked.value.toString()}</label>

      <h2>Multi Checkbox</h2>
      {["Jack", "John", "Mike"].map((name) => (
        <div key={name}>
          <input
            type="checkbox"
            id={name}
            value={name}
            checked={checkedNames.value.includes(name)}
            onChange={(e) => {
              if (e.target.checked) {
                checkedNames.value = [...checkedNames.value, name];
              } else {
                checkedNames.value = checkedNames.value.filter(
                  (n) => n !== name
                );
              }
            }}
          />
          <label htmlFor={name}>{name}</label>
        </div>
      ))}
      <p>Checked names: {checkedNames.value.join(", ")}</p>

      <h2>Radio</h2>
      {["One", "Two"].map((value) => (
        <div key={value}>
          <input
            type="radio"
            id={value}
            value={value}
            checked={picked.value === value}
            onChange={() => (picked.value = value)}
          />
          <label htmlFor={value}>{value}</label>
        </div>
      ))}
      <p>Picked: {picked.value}</p>

      <h2>Select</h2>
      <select
        value={selected.value}
        onChange={(e) => (selected.value = e.target.value)}
      >
        <option disabled value="">
          Please select one
        </option>
        {["A", "B", "C"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p>Selected: {selected.value}</p>

      <h2>Multi Select</h2>
      <select
        multiple
        style={{ width: "100px" }}
        value={multiSelected.value}
        onChange={(e) =>
          (multiSelected.value = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value
          ))
        }
      >
        {["A", "B", "C"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p>Selected: {multiSelected.value.join(", ")}</p>
    </div>
  );
}

export default App;
