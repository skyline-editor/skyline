import React, { useEffect, useState } from "react";
import styles from '../../styles/CodeEditor.module.css'
import { highlight } from "./tokenizer";

import { Cursor } from "./util/cursor";
import { Selection } from "./util/selection";
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

const state = { cursors: [], code: '', selections: [] };

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
  const [selections, setSelections] = useState<Selection[]>([]);

  const [activeSelection, setActiveSelection] = useState<Cursor | null>(null);


  state.cursors = cursors;
  state.selections = selections;
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
        setSelections(state.selections.slice());
        return;
      }

      const { code, cursors } = addText(state.code, e.key, state.cursors);
      
      setCode(code);
      setCursors(cursors);
      setSelections(state.selections.slice());
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

        const cursor = new Cursor(Math.floor(y / Char.height), Math.floor(x / Char.width)).validate(code, false);
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
          cursor = cursor.validate(code);
          return !new_cursors.find((v, j) => {
            v = v.validate(code);
            if (i === j) return false;
            return v.line === cursor.line && v.column === cursor.column
          });
        });

        setCursors(new_cursors);
        setActiveSelection(cursor);
        setSelections([ new Selection(cursor) ]);
      }}
      onMouseMove={e => {
        e.preventDefault();

        const lastCursor = activeSelection;
        if (!lastCursor) return;

        const lines = code.split('\n');

        const editor = e.currentTarget.closest('.' + styles.codeEditor);
        const x = e.clientX - editor.getBoundingClientRect().left;
        const y = e.clientY - editor.getBoundingClientRect().top;

        const cursor = new Cursor(Math.floor(y / Char.height), Math.floor(x / Char.width)).validate(code, false);
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

        const new_cursors = [lastCursor, cursor].sort(Cursor.compare) as [Cursor, Cursor];
        const selection = new Selection(...new_cursors);

        cursors.splice(cursors.length - 1, 1, cursor);
        setCursors(cursors.slice());
        setSelections([selection]);
      }}
      onMouseUp={e => {
        e.preventDefault();

        const lastCursor = activeSelection;
        if (!lastCursor) return;

        const lines = code.split('\n');

        const editor = e.currentTarget.closest('.' + styles.codeEditor);
        const x = e.clientX - editor.getBoundingClientRect().left;
        const y = e.clientY - editor.getBoundingClientRect().top;

        const cursor = new Cursor(Math.floor(y / Char.height), Math.floor(x / Char.width)).validate(code, false);
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

        const new_cursors = [lastCursor, cursor].sort(Cursor.compare) as [Cursor, Cursor];
        const selection = new Selection(...new_cursors);
        console.log(selection.getText(code));

        cursors.splice(cursors.length - 1, 1, cursor);

        const same = cursor.line === lastCursor.line && cursor.column === lastCursor.column;
        setCursors(cursors.slice());
        setSelections(same ? [] : [selection]);
        setActiveSelection(null);
      }}
    >
      <Selections selections={selections} code={code} />
      <Code code={code} />
      <Cursors cursors={cursors.map(cursor => cursor.validate(code))} />
    </div>
  );
}

let list_id = 0;
const Code: React.FC<{ code: string }> = ({ code }) => {
  const [tokenizedCode, setTokenizedCode] = useState<React.ReactFragment>(null);
  useEffect(() => {
    setTokenizedCode(highlight(code, 'typescript').map(v => (<div className={styles.line} key={list_id++}>{v.map(v => {
      return (
        <span style={{ color: v.color }}>{v.text}</span>
      );
    })}</div>)));
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

const Selections = ({ selections, code }: {selections: Selection[], code: string}) => {
  return (
    <div>
      {selections.map(selection => (
        <DisplaySelection code={code} selection={selection} key={list_id++} />
      ))}
    </div>
  );
};

const RoundedElem = ({ x, y, radius }: { x: number, y: number, radius: {
  topLeft?: boolean,
  topRight?: boolean,
  bottomLeft?: boolean,
  bottomRight?: boolean,
} }) => {
  const radiuses = {} as React.CSSProperties;
  if (!radius.topLeft) radiuses.borderTopLeftRadius = 0;
  if (!radius.topRight) radiuses.borderTopRightRadius = 0;
  if (!radius.bottomLeft) radiuses.borderBottomLeftRadius = 0;
  if (!radius.bottomRight) radiuses.borderBottomRightRadius = 0;

  return (
    <>
      <div className={styles.selection_block} style={{
        top: Char.height * y,
        left: Char.width * x,

        width: Char.width,
        height: Char.height,
      }} />
      <div className={styles.selection_rounded} style={{
        top: Char.height * y,
        left: Char.width * x,

        width: Char.width,
        height: Char.height,

        ...radiuses
      }} />
    </>
  );
};

const DisplaySelection = ({ selection, code }: {selection: Selection, code: string}) => {
  const code_lines = code.split('\n');

  const lines = [];
  for (let i = 0; i <= selection.end.line - selection.start.line; i++) {
    const line = selection.start.line + i;
    const length = code_lines[line].length;

    let style = {
      top: Char.height * i,
      left: Char.width * (selection.start.line === line ? selection.start.column : 0),
      width: Char.width * ((selection.end.line === line ? selection.end.column : length + 1) - (selection.start.line === line ? selection.start.column : 0)),
      height: 20,
    } as React.CSSProperties;


    const beforeLength = i < 1 ? 0 : code_lines[line - 1].length;
    if (beforeLength >= length && !(selection.start.line === line - 1 && selection.start.column > length)) style.borderTopRightRadius = 0;

    const nextLength = line >= selection.end.line ? 0 : code_lines[line + 1].length;
    if (nextLength >= length) style.borderBottomRightRadius = 0;

    if (i > 0 && (selection.start.line + 1 !== line || selection.start.column < 1)) style.borderTopLeftRadius = 0;
    if (selection.end.line !== line && !(selection.start.line === line && selection.start.column > nextLength)) style.borderBottomLeftRadius = 0;

    let beforeElem;
    if ((i < 1 && selection.start.column > 0) && !(selection.start.line === line && selection.start.column > nextLength)) {
      beforeElem = (
        <RoundedElem
          x={selection.start.column - 1}
          y={0}
          radius={{
            bottomRight: true
          }}
          key={list_id++}
        />);
    }

    let round_top = beforeLength > length && !(selection.start.line === line - 1 && selection.start.column > length);
    let round_bottom = nextLength > length;

    let afterElem;
    if ((round_top || round_bottom) && (i > 0 && line < selection.end.line)) {
      afterElem = (
        <RoundedElem
          x={length + 1}
          y={i}
          radius={{
            topLeft: round_top,
            bottomLeft: round_bottom
          }}
          key={list_id++}
        />
      );
    }

    lines.push(<div>
      {beforeElem}
      <div
        className={styles.selection_line}
        key={list_id++}
        style={style}
      />
      {afterElem}
    </div>);
  }

  return (
    <div className={styles.selection} style={{
      top: Char.height * selection.start.line,
    }} >
      {lines}
    </div>
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