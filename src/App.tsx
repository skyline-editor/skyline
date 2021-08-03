/*
    Copyright 2021 Tejas Ravishankar, Eliyah Sundström, Pranav Doshi
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

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
