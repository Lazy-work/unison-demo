import "./App.css";
import { ref, computed, watchEffect } from "@unisonjs/vue";
import clsx from 'clsx';

const STORAGE_KEY = 'unison-todomvc';

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed),
};

// state
const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
const visibility = ref('all');
const editedTodo = ref(null);

// derived state
const filteredTodos = computed(() => filters[visibility.value](todos.value));
const remaining = computed(() => filters.active(todos.value).length);

// persist state
watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
});

function toggleAll(e) {
  todos.value.forEach((todo) => (todo.completed = e.target.checked));
}

function addTodo(e) {
  const value = e.target.value.trim();
  if (value) {
    todos.value.push({
      id: Date.now(),
      title: value,
      completed: false,
    });
    e.target.value = '';
  }
}

function removeTodo(todo) {
  todos.value.splice(todos.value.indexOf(todo), 1);
}

let beforeEditCache = '';
function editTodo(todo) {
  beforeEditCache = todo.title;
  editedTodo.value = todo;
}

function cancelEdit(todo) {
  editedTodo.value = null;
  todo.title = beforeEditCache;
}

function doneEdit(todo) {
  if (editedTodo.value) {
    editedTodo.value = null;
    todo.title = todo.title.trim();
    if (!todo.title) removeTodo(todo);
  }
}

function removeCompleted() {
  todos.value = filters.active(todos.value);
}

function onHashChange() {
  const route = window.location.hash.replace(/#\/?/, '');
  if (filters[route]) {
    visibility.value = route;
  } else {
    window.location.hash = '';
    visibility.value = 'all';
  }
}

// handle routing
window.addEventListener('hashchange', onHashChange);
onHashChange();

// App Component
function App() {
  return (
    <section className="todoapp">
      <header className="header">
        <h1>Todos</h1>
        <input className="new-todo" autoFocus placeholder="What needs to be done?" onKeyDown={(e) => e.key === 'Enter' && addTodo(e)} />
      </header>
      <section className="main" style={{ display: todos.value.length ? 'block' : 'none' }}>
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={remaining.value === 0}
          onChange={toggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {filteredTodos.value.map((todo) => (
            <li key={todo.id} className={clsx('todo', { completed: todo.completed, editing: todo === editedTodo.value })}>
              <div className="view">
                <input className="toggle" type="checkbox" checked={todo.completed} onChange={() => (todo.completed = !todo.completed)} />
                <label onDoubleClick={() => editTodo(todo)}>{todo.title}</label>
                <button className="destroy" onClick={() => removeTodo(todo)}></button>
              </div>
              {todo === editedTodo.value && (
                <input
                  className="edit"
                  type="text"
                  value={todo.title}
                  onInput={(e) => todo.title = e.target.value}
                  autoFocus
                  onBlur={() => doneEdit(todo)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') doneEdit(todo);
                    if (e.key === 'Escape') cancelEdit(todo);
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
      <footer className="footer" style={{ display: todos.value.length ? 'block' : 'none' }}>
        <span className="todo-count">
          <strong>{remaining.value}</strong>
          <span>{remaining.value === 1 ? ' item' : ' items'} left</span>
        </span>
        <ul className="filters">
          <li>
            <a href="#/all" className={clsx({ selected: visibility.value === 'all' })}>
              All
            </a>
          </li>
          <li>
            <a href="#/active" className={clsx({ selected: visibility.value === 'active' })}>
              Active
            </a>
          </li>
          <li>
            <a href="#/completed" className={clsx({ selected: visibility.value === 'completed' })}>
              Completed
            </a>
          </li>
        </ul>
        <button className="clear-completed" onClick={removeCompleted} style={{ display: todos.value.length > remaining.value ? 'block' : 'none' }}>
          Clear completed
        </button>
      </footer>
    </section>
  );
}

export default App;

