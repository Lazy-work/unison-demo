import { ref, reactive, computed, watch } from '@unisonjs/vue';

function App() {
  const names = reactive(['Emil, Hans', 'Mustermann, Max', 'Tisch, Roman']);
  const selected = ref('');
  const prefix = ref('');
  const first = ref('');
  const last = ref('');

  const filteredNames = computed(() =>
    names.filter((n) => n.toLowerCase().startsWith(prefix.value.toLowerCase()))
  );

  watch(selected, (name) => {
    [last.value, first.value] = name.split(', ');
  });

  function create() {
    if (hasValidInput()) {
      const fullName = `${last.value}, ${first.value}`;
      if (!names.includes(fullName)) {
        names.push(fullName);
        first.value = last.value = '';
      }
    }
  }

  function update() {
    if (hasValidInput() && selected.value) {
      const i = names.indexOf(selected.value);
      names[i] = selected.value = `${last.value}, ${first.value}`;
    }
  }

  function del() {
    if (selected.value) {
      const i = names.indexOf(selected.value);
      names.splice(i, 1);
      selected.value = first.value = last.value = '';
    }
  }

  function hasValidInput() {
    return first.value.trim() && last.value.trim();
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={prefix.value}
          onInput={(e) => (prefix.value = e.target.value)}
          placeholder="Filter prefix"
        />
      </div>

      <select size={5} value={selected.value} onChange={(e) => (selected.value = e.target.value)}>
        {filteredNames.value.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>

      <label>
        Name: <input type="text" value={first.value} onInput={(e) => (first.value = e.target.value)} />
      </label>
      <label>
        Surname: <input type="text" value={last.value} onInput={(e) => (last.value = e.target.value)} />
      </label>

      <div className="buttons">
        <button onClick={create}>Create</button>
        <button onClick={update}>Update</button>
        <button onClick={del}>Delete</button>
      </div>
    </div>
  );
}

export default App;
