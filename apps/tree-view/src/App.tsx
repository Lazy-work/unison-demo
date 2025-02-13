import { ref } from '@unisonjs/vue'
import unisonLogo from './assets/unison.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const count = ref(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://unisonjs.netlify.app/" target="_blank">
          <img src={unisonLogo} className="logo unison" alt="Unison logo" />
        </a>
      </div>
      <h1>Vite + Unison (Vue)</h1>
      <div className="card">
        <button onClick={() => count.value++}>
          count is {count.value}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Unison logos to learn more
      </p>
    </>
  )
}

export default App
