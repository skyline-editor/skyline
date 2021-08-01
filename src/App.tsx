// Styles
import "./App.css";

// Components
import CodeEditor from "./components/codeeditor";
import Sidebar from "./components/Sidebar/Sidebar";

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
          <CodeEditor
            initialValue="# This program prints Hello, world!
print('Hello, world!')"
          />
        </div>
      </div>
    </div>
  );
}

export default App;