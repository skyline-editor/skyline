import { KeyboardShortcut } from "../codeEditor";
import { Cursor } from "../util/cursor";
const shortcuts: KeyboardShortcut[] = [];

function moveCursors(code: string, cursors: Cursor[], change: Cursor) : Cursor[] {
  cursors = cursors.map(cursor => cursor.move(code, change, false));
  cursors = cursors.filter((cursor, i) => {
    cursor = cursor.validate(code);
    return !cursors.find((v, j) => {
      v = cursor.validate(code);
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
    cursors = moveCursors(code, cursors, new Cursor(-1, 0));

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
    cursors = moveCursors(code, cursors, new Cursor(1, 0));

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
    cursors = moveCursors(code, cursors, new Cursor(0, -1));

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
    cursors = moveCursors(code, cursors, new Cursor(0, 1));

    return {
      code,
      cursors
    }
  }
});

export default shortcuts;