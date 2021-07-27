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

function moveCursors(code: string, cursors: Cursor[], change: Cursor) : Cursor[] {
  cursors = cursors.map(cursor => moveCursor(code, cursor, change));
  cursors = cursors.filter((cursor, i) => {
    cursor = validateCursor(code, cursor);
    return !cursors.find((v, j) => {
      v = validateCursor(code, v);
      if (i >= j) return false;
      return v.line === cursor.line && v.column === cursor.column
    });
  });

  return cursors;
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

function addTextCursor(code: string, key: string, cursor: Cursor) : { code: string, cursor: Cursor } {
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
function addText(code: string, key: string, cursors: Cursor[]) : { code: string, cursors: Cursor[] } {
  return { code, cursors };
  /*
  if (key.length > 1 && !(key in write_modes)) return { code, cursors };
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
  */
}

const state = { cursors: null, code: null };

export const CodeEditor = ({
  initialValue,
}) => {
  const [code, setCode] = useState(initialValue);
  const [cursors, setCursors] = useState<Cursor[]>([]);


  state.cursors = cursors;
  state.code = code;

  useEffect(() => {
    window.addEventListener('blur', e => {
      setCursors([]);
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        setCursors(moveCursors(state.code, state.cursors, {
          line: 1,
          column: 0,
        }));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowUp') {
        setCursors(moveCursors(state.code, state.cursors, {
          line: -1,
          column: 0,
        }));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowLeft') {
        setCursors(moveCursors(state.code, state.cursors, {
          line: 0,
          column: -1,
        }));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowRight') {
        setCursors(moveCursors(state.code, state.cursors, {
          line: 0,
          column: 1,
        }));
        e.preventDefault();
        return;
      }

      const { code, cursors } = addText(state.code, e.key, state.cursors);
      
      setCursors(cursors);
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

        let new_cursors = cursors.slice();
        if (e.ctrlKey) {
          new_cursors.push(cursor);
        } else {
          new_cursors = [cursor];
        }

        new_cursors = new_cursors.filter((cursor, i) => {
          cursor = validateCursor(code, cursor);
          return !new_cursors.find((v, j) => {
            v = validateCursor(code, v);
            if (i === j) return false;
            return v.line === cursor.line && v.column === cursor.column
          });
        });
        setCursors(new_cursors);
      }}
    >
      <Code code={code} />
      <Cursors cursors={cursors.map(cursor => validateCursor(code, cursor))} />
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
const Cursors = ({ cursors }: {cursors: Cursor[]}) => {
  return (
    <div>
      {cursors.map(cursor => (
        <Cursor cursor={cursor} key={list_id++} />
      ))}
    </div>
  );
};

const Cursor = ({ cursor }: {cursor: Cursor}) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setBlink(true);
  }, [cursor]);

  useEffect(() => {
    if (blink) setTimeout(() => setBlink(false), 100);
  }, [blink]);

  return (
    <div className={blink ? styles.cursor : styles.cursor_blink} style={{ top: Char.height * cursor.line, left: Char.width * cursor.column }} />
  );
};

export default CodeEditor;