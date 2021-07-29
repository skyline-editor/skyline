import React, { useEffect, useState } from "react";
import styles from '../../styles/CodeEditor.module.css'
import { highlight } from "./tokenizer";

import { Cursor, validateCursor } from "./util/cursor";
import { addText } from "./util/text";

import moveShortcuts from './shortcuts/move';
import copyLineShortcuts from './shortcuts/copyLine';
import copyCursorShortcuts from './shortcuts/copyCursor';

export interface CodeEditorProps {
  initialValue: string;
  onChange?: (code: string) => void;
}

export const Char = {
  width: 11,
  height: 20,
};

const state = { cursors: [], code: '' };

export interface KeyboardShortcut {
  key?: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;

  name: string;
  description?: string;
  exec: (code: string, cursors: Cursor[], event: KeyboardEvent) => { code: string, cursors: Cursor[] } | undefined | null;
}

const keyboardShortcuts: KeyboardShortcut[] = [];
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

      for (const keyboardShortcut of keyboardShortcuts) {
        const { exec } = keyboardShortcut;
        const { ctrl, alt, shift, key } = keyboardShortcut;

        if (typeof key !== 'undefined' && e.key !== key) continue;
        if (typeof ctrl !== 'undefined' && ctrl !== e.ctrlKey) continue;
        if (typeof alt !== 'undefined' && alt !== e.altKey) continue;
        if (typeof shift !== 'undefined' && shift !== e.shiftKey) continue;

        const result = exec(state.code, state.cursors, e);
        if (!result) continue;

        e.preventDefault();
        
        const { code, cursors } = result;
        setCode(code);
        setCursors(cursors);
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
        
        const lines = code.split('\n');

        const editor = e.currentTarget.closest('.' + styles.codeEditor);
        const x = e.clientX - editor.getBoundingClientRect().left;
        const y = e.clientY - editor.getBoundingClientRect().top;

        const cursor = validateCursor(code, {
          line: Math.floor(y / Char.height),
          column: Math.floor(x / Char.width),
        });
        
        if (cursor.line < 0) {
          cursor.line = 0;
          cursor.column = 0;
        }

        if (cursor.line >= lines.length) {
          cursor.line = lines.length;
          cursor.column = lines[cursor.line].length;
        }

        if (cursor.column < 0) cursor.column = 0;
        if (cursor.column > lines[cursor.line].length) cursor.column = lines[cursor.line].length;

        let new_cursors = cursors.slice();
        if (e.altKey) {
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
    setTokenizedCode(highlight(code, 'typescript').map(v => (<div className={styles.line} key={list_id++}>{v}</div>)));
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
        <DisplayCursor cursor={cursor} key={list_id++} />
      ))}
    </div>
  );
};

const DisplayCursor = ({ cursor }: {cursor: Cursor}) => {
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

keyboardShortcuts.push(...moveShortcuts);
keyboardShortcuts.push(...copyLineShortcuts);
keyboardShortcuts.push(...copyCursorShortcuts);

keyboardShortcuts.push({
  name: 'Escape',
  description: 'Clear all cursors except the first one',

  key: 'Escape',
  exec: (code, cursors) => {
    return {
      code,
      cursors: cursors.slice(0, 1)
    };
  }
});

keyboardShortcuts.push({
  name: 'Tab',
  description: 'adds an tab',

  key: 'Tab',
  exec: (code, cursors) => {
    return addText(code, 'Tab', cursors);
  }
});

keyboardShortcuts.push({
  name: 'Select Line',
  description: 'Selects entire line',

  key: 'l',
  ctrl: true,
  exec: (code, cursors) => {
    return {
      code,
      cursors
    };
  }
});