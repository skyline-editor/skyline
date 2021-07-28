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

      if (line < 0) {
        line = 0;
        column = 0;
      } else {
        column = lines[line].length;
      }
    }
    if (column > lines[line].length) {
      line++;

      if (line >= lines.length) {
        line = lines.length - 1;
        column = lines[line].length;
      } else {
        column = 0;
      }
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
  const validated = validateCursor(code, cursor);

  cursor.line = change.line ? validated.line : cursor.line;
  cursor.column = change.column ? validated.column : cursor.column;

  return cursor;
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

function addTextCursor(code: string, key: string, cursor: Cursor, affected: Cursor[]) : string {
  if (key.length > 1 && !(key in write_modes)) return code;
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
        affected.map(v => v.line -= 1);
      }
    } else {
      const lineText = line.substring(0, column - 1);
      const lineEnd = line.substring(column);

      const newLine = lineText + lineEnd;
      lines.splice(cursor.line, 1, newLine);

      cursor.column--;
      affected.map(v => v.column += v.line === cursor.line ? -1 : 0);
    }
  }
  if (mode === 'insert') {
    const text = args[0] as string;
    let extra = '';
    if (text === '(') extra = ')';
    if (text === '{') extra = '}';
    if (text === '[') extra = ']';
    if (text === '<') extra = '>';
    if (text === '"') extra = '"';
    if (text === '\'') extra = '\'';
    if (text === '`') extra = '`';

    state.extra = extra;

    const lineText = line.substring(0, column);
    const lineEnd = line.substring(column);

    const newLine = lineText + text + extra + lineEnd;
    lines.splice(cursor.line, 1, newLine);

    if (text === '\n') {
      cursor.line++;
      cursor.column = 0;
    } else {
      cursor.column += text.length;
    }

    affected.map(v => v.column += v.line === cursor.line ? text.length : 0);
  }
  
  return lines.join('\n');
}
function addText(code: string, key: string, cursors: Cursor[]) : { code: string, cursors: Cursor[] } {
  if (key === state.extra) {
    state.extra = '';

    return {
      code,
      cursors: cursors.map(v => {
        v.column++;
        return v;
      }),
    };
  }

  cursors = cursors.sort((a, b) => {
    if (a.line < b.line) return -1;
    if (a.line > b.line) return 1;
    if (a.column < b.column) return -1;
    if (a.column > b.column) return 1;
    return 0;
  });

  for (let i = 0; i < cursors.length; i++) {
    const cursor = cursors[i];
    code = addTextCursor(code, key, cursor, cursors.slice(i + 1));
  }

  cursors = cursors.filter((cursor, i) => {
    cursor = validateCursor(code, cursor);
    return !cursors.find((v, j) => {
      v = validateCursor(code, v);
      if (i >= j) return false;
      return v.line === cursor.line && v.column === cursor.column
    });
  });

  return {
    code,
    cursors,
  };
}

const state = { cursors: [], code: '', extra: '' };

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
      if (state.cursors.length < 1) return;

      if (e.key === 'Escape' || e.key === 'Esc') setCursors(state.cursors.slice(0, 1));

      if (e.key === 'Tab') e.preventDefault();

      if (e.ctrlKey && e.altKey && !e.metaKey && !e.shiftKey) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          
          const new_cursors = state.cursors.slice();
          const last_cursor = new_cursors.reduce((acc, v) => {
            if (v.line === acc.line) return v.column > acc.column ? v : acc;
            return v.line > acc.line ? v : acc;
          }, new_cursors[0])
          
          if (last_cursor.line >= code.split('\n').length - 1) return;
          new_cursors.push({
            line: last_cursor.line + 1,
            column: last_cursor.column,
          });
          
          setCursors(new_cursors);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          
          const new_cursors = state.cursors.slice();
          const first_cursor = new_cursors.reduce((acc, v) => {
            if (v.line === acc.line) return v.column < acc.column ? v : acc;
            return v.line < acc.line ? v : acc;
          }, new_cursors[0])

          if (first_cursor.line < 1) return;
          new_cursors.push({
            line: first_cursor.line - 1,
            column: first_cursor.column,
          });

          setCursors(new_cursors);
          return;
        }
      }
      if (!e.ctrlKey && !e.altKey) {
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
      }
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

        const cursor = validateCursor(code, {
          line: Math.floor(y / Char.height),
          column: Math.floor(x / Char.width),
        });

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
    if (blink) {
      const timeout = setTimeout(() => setBlink(false), 100);

      return () => {
        clearTimeout(timeout);
      }
    }
  }, [blink]);

  return (
    <div className={blink ? styles.cursor : styles.cursor_blink} style={{ top: Char.height * cursor.line, left: Char.width * cursor.column }} />
  );
};

export default CodeEditor;