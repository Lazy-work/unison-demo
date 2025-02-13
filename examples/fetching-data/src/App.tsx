import { ref, watchEffect } from '@unisonjs/vue'
import './App.css'

function App() {
  const API_URL = `https://api.github.com/repos/vuejs/core/commits?per_page=3&sha=`;
  const branches = ['main', 'minor'];
  const currentBranch = ref(branches[0]);
  const commits = ref([]);

  watchEffect(async () => {
    const url = `${API_URL}${currentBranch.value}`;
    const response = await fetch(url);
    commits.value = await response.json();
  });

  function truncate(v) {
    const newline = v.indexOf('\n');
    return newline > 0 ? v.slice(0, newline) : v;
  }

  function formatDate(v) {
    return v.replace(/T|Z/g, ' ');
  }

  return (
    <div>
      <h1>Latest Vue Core Commits</h1>
      <div>
        {branches.map(branch => (
          <label key={branch}>
            <input
              type="radio"
              value={branch}
              name="branch"
              checked={currentBranch.value === branch}
              onChange={() => { currentBranch.value = branch; }}
            />
            {branch}
          </label>
        ))}
      </div>
      <p>vuejs/core@{currentBranch.value}</p>
      {commits.value.length > 0 && (
        <ul>
          {commits.value.map(({ html_url, sha, author, commit }) => (
            <li key={sha}>
              <a href={html_url} target="_blank" className="commit">{sha.slice(0, 7)}</a>
              - <span className="message">{truncate(commit.message)}</span><br />
              by <span className="author">
                <a href={author.html_url} target="_blank">{commit.author.name}</a>
              </span>
              at <span className="date">{formatDate(commit.author.date)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default App
