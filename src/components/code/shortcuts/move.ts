import { KeyboardShortcut } from "../codeEditor";
import { Cursor, validateCursor } from "../util/cursor";
const shortcuts: KeyboardShortcut[] = [];

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

shortcuts.push({
  name: 'Up',
  description: "Move cursors up",

  key: 'ArrowUp',
  ctrl: false,
  alt: false,
  shift: false,

  exec: (code, cursors) => {
    cursors = moveCursors(code, cursors, {
      line: -1,
      column: 0,
    });

    return {
      code,
      cursors
    }
  }
});
shortcuts.push({
  name: 'Down',
  description: "Move cursors down",

  key: 'ArrowDown',
  ctrl: false,
  alt: false,
  shift: false,

  exec: (code, cursors) => {
    cursors = moveCursors(code, cursors, {
      line: 1,
      column: 0,
    });

    return {
      code,
      cursors
    }
  }
});
shortcuts.push({
  name: 'Left',
  description: "Move cursors left",

  key: 'ArrowLeft',
  ctrl: false,
  alt: false,
  shift: false,

  exec: (code, cursors) => {
    cursors = moveCursors(code, cursors, {
      line: 0,
      column: -1,
    });

    return {
      code,
      cursors
    }
  }
});
shortcuts.push({
  name: 'Right',
  description: "Move cursors right",

  key: 'ArrowRight',
  ctrl: false,
  alt: false,
  shift: false,

  exec: (code, cursors) => {
    cursors = moveCursors(code, cursors, {
      line: 0,
      column: 1,
    });

    return {
      code,
      cursors
    }
  }
});

export default shortcuts;