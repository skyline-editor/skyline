import { useEffect, useState } from "react";
import styles from '../../styles/CodeEditor.module.css'
import { highlight } from "./tokenizer";

export interface CodeEditorProps {
  initialValue: string;
  onChange?: (code: string) => void;
}

interface Cursor {
  line: number;
  column: number;
}

const Char = {
  width: 11,
  height: 20,
};

const state = { cursor: null };

export const CodeEditor = ({
  initialValue,
}) => {
  const [code, setCode] = useState(initialValue);
  const [cursor, setCursor] = useState({
    line: 7,
    column: 1,
  });

  state.cursor = cursor;

  useEffect(() => {
    window.addEventListener('keydown', e => {
      console.log(e.key, state.cursor);
      if (e.key === 'ArrowDown') {
        setCursor({
          line: state.cursor.line + 1,
          column: state.cursor.column,
        });
      }
      if (e.key === 'ArrowUp') {
        setCursor({
          line: state.cursor.line - 1,
          column: state.cursor.column,
        });
      }
      if (e.key === 'ArrowLeft') {
        setCursor({
          line: state.cursor.line,
          column: state.cursor.column - 1,
        });
      }
      if (e.key === 'ArrowRight') {
        setCursor({
          line: state.cursor.line,
          column: state.cursor.column + 1,
        });
      }
    });
  }, []);
  
  return (
    <div
      className={styles.codeEditor}
    >
      <Code code={code} />
      <Cursors cursor={cursor} />
    </div>
  );
}

const Code = ({ code }: {code: string}) => {
  return (
    <div>
      {highlight(code).map(v => (<div className={styles.line}>{v}</div>))}
    </div>
  );
};
const Cursors = ({ cursor }: {cursor: Cursor}) => {
  return (
    <div>
      <div className={styles.cursor} style={{ top: Char.height * cursor.line, left: Char.width * cursor.column }} />
    </div>
  );
};

export default CodeEditor;