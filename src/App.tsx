// Styles
import './App.css';

// Components
import CodeEditor from './components/codeeditor';
import Sidebar from './components/Sidebar/Sidebar';
import Titlebar from './components/Titlebar/Titlebar';

function App() {
  return (
    <div className="container">
      <header>
        <title>Skyline Editor</title>
      </header>

      {/* Title bar */}
      {/* <Titlebar /> */}

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
