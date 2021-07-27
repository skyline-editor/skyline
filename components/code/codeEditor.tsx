import React, { useEffect, useState } from "react";
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

function moveCursor(code: string, cursor: Cursor, change: Cursor) : Cursor {
  const lines = code.split('\n');

  let line = cursor.line;
  let column = cursor.column;

  const validated = validateCursor(code, {
    line: cursor.line,
    column: cursor.column
  });

  if (change.line) {
    line = validated.line + change.line;
    if (line < 0) line = 0;
    if (line >= lines.length) line = lines.length - 1;
  }
  
  if (change.column) {
    column = validated.column + change.column;
    if (column < 0) {
      line--;
      if (line < 0) line = 0;
      column = lines[line].length;
    }
    if (column > lines[line].length) {
      line++;
      if (line >= lines.length) line = lines.length - 1;
      column = 0;
    }
  }

  return {
    line,
    column,
  };
}



function validateCursorSome(code: string, cursor: Cursor, change: { line?: boolean, column?: boolean}) : Cursor {
  const validated = validateCursor(code, {
    line: cursor.line,
    column: cursor.column
  });

  return {
    line: change.line ? validated.line : cursor.line,
    column: change.column ? validated.column : cursor.column,
  };
}

function validateCursor(code: string, cursor: Cursor) : Cursor {
  const lines = code.split('\n');

  let line = cursor.line;
  let column = cursor.column;

  if (line < 0) line = 0;
  if (line >= lines.length) line = lines.length - 1;
  
  if (column < 0) column = 0;
  if (column > lines[line].length) column = lines[line].length;

  return {
    line,
    column,
  };
}

const tab_size = 2;

type delete_mode = ['delete', number];
type insert_mode = ['insert', string];
type write_mode = delete_mode | insert_mode;

const write_modes = {
  'Backspace': ['delete', -1],
  'Delete': ['delete', 1],
  'Tab': ['insert', ' '.repeat(tab_size)],
  'Enter': ['insert', '\n'],
} as {[key: string]: write_mode};

function addText(code: string, key: string, cursor: Cursor) : { code: string, cursor: Cursor } {
  if (key.length > 1 && !(key in write_modes)) return { code, cursor };
  let [mode, ...args] = ['insert', key] as write_mode;
  if (key in write_modes) [mode, ...args] = write_modes[key];

  cursor = validateCursorSome(code, cursor, { column: true });

  const lines = code.split('\n');
  const line = lines[cursor.line];
  const column = cursor.column;

  if (mode === 'delete') {
    if (cursor.column < 1) {
      if (cursor.line > 0) {
        const lineText = lines[cursor.line - 1];
        const lineEnd = line;

        const newLine = lineText + lineEnd;
        lines.splice(cursor.line - 1, 2, newLine);

        cursor.line--;
        cursor.column = lineText.length;
      }
    } else {
      const lineText = line.substring(0, column - 1);
      const lineEnd = line.substring(column);

      const newLine = lineText + lineEnd;
      lines.splice(cursor.line, 1, newLine);

      cursor.column--;
    }
  }
  if (mode === 'insert') {
    const text = args[0] as string;

    const lineText = line.substring(0, column);
    const lineEnd = line.substring(column);

    const newLine = lineText + text + lineEnd;
    lines.splice(cursor.line, 1, newLine);

    if (text === '\n') {
      cursor.line++;
      cursor.column = 0;
    } else {
      cursor.column += text.length;
    }
  }
  
  code = lines.join('\n');
  return { code, cursor };
}

const state = { cursor: null, code: null };

export const CodeEditor = ({
  initialValue,
}) => {
  const [code, setCode] = useState(initialValue);
  const [cursor, setCursor] = useState({
    line: 7,
    column: 1,
  });


  state.cursor = cursor;
  state.code = code;

  useEffect(() => {
    window.addEventListener('keydown', e => {
      console.log(e.key, state.cursor);
      if (e.key === 'ArrowDown') {
        setCursor(moveCursor(state.code, state.cursor, {
          line: 1,
          column: 0,
        }));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowUp') {
        setCursor(moveCursor(state.code, state.cursor, {
          line: -1,
          column: 0,
        }));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowLeft') {
        setCursor(moveCursor(state.code, state.cursor, {
          line: 0,
          column: -1,
        }));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowRight') {
        console.log(state.cursor, state.code);
        setCursor(moveCursor(state.code, state.cursor, {
          line: 0,
          column: 1,
        }));
        e.preventDefault();
        return;
      }

      const { code, cursor } = addText(state.code, e.key, state.cursor);
      
      setCursor(cursor);
      setCode(code);
    });
  }, []);
  
  return (
    <div
      className={styles.codeEditor}
      onMouseDown={e => {
        e.preventDefault();
        
        const editor = e.currentTarget.closest('.' + styles.codeEditor);
        const x = e.clientX - editor.getBoundingClientRect().left;
        const y = e.clientY - editor.getBoundingClientRect().top;

        const cursor = {
          line: Math.floor(y / Char.height),
          column: Math.floor(x / Char.width),
        };

        console.log(cursor);
        setCursor(cursor);
      }}
    >
      <Code code={code} />
      <Cursors cursor={validateCursor(code, cursor)} />
    </div>
  );
}

let list_id = 0;
const Code: React.FC<{ code: string }> = ({ code }) => {
  const [tokenizedCode, setTokenizedCode] = useState<React.ReactFragment>(null);
  
  useEffect(() => {
    setTokenizedCode(highlight(code).map(v => (<div className={styles.line} key={list_id++}>{v}</div>)));
  }, [code]);

  return (
    <div>
      {tokenizedCode}
    </div>
  );
};
const Cursors = ({ cursor }: {cursor: Cursor}) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setBlink(true);
  }, [cursor]);

  useEffect(() => {
    if (blink) setTimeout(() => setBlink(false), 100);
  }, [blink]);

  return (
    <div>
      <div className={blink ? styles.cursor : styles.cursor_blink} style={{ top: Char.height * cursor.line, left: Char.width * cursor.column }} />
    </div>
  );
};

export default CodeEditor;