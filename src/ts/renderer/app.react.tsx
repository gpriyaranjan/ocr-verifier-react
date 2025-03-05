import ReactDOM from 'react-dom/client';

import TopPanel from './top_panel.react.js';
// import TopPanel2 from './top_panel_2.react.js';

function App() {
  return (
    <div>
      <TopPanel/>
    </div>
  )
}

window.onload = function() {
  console.log("window.onload invoked");
  const rootElement = document.getElementById('app');
  const root = ReactDOM.createRoot(rootElement!);
  root.render(<App />);
}