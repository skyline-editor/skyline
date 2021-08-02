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
