import ReactDOM from 'react-dom/client';

import TopPanel from './top_panel.react.js';

function App() {
  return (
    <div>
      <TopPanel/>
    </div>
  )
}

window.onload = function() {
  const rootElement = document.getElementById('app');
  const root = ReactDOM.createRoot(rootElement!);
  root.render(<App />);
}