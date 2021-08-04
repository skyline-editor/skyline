// Styles
import './App.css';

// Components
import CodeEditor from './components/codeeditor';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <div className="container">
      <header>
        <title>Skyline Editor</title>
      </header>

      <div data-tauri-drag-region className="titlebar">
        <div className="titlebar-button" id="titlebar-minimize">
          <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-maximize">
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-close">
          <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
        </div>
      </div>

      {/* Code Editor */}
      <div className="editor">
        <Sidebar />
        <div className="code">
          <CodeEditor initialValue={`import { greet } from 'hello'`} />
        </div>
      </div>
    </div>
  );
}

export default App;
