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
            initialValue={`{
  "name": "Skyline",
  "version": "0.0.1",
  "description": "A simple editor for the web.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Skyline",
  "license": "MIT",
  "dependencies": {
    "react": "^15.4.2",
    "react-dom": "^15.4.2"
  }
  "number": 1
  "boolean": true
}`}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
