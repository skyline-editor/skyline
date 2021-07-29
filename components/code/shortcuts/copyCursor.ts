import { KeyboardShortcut } from "../codeEditor";
import { Cursor } from "../util/cursor";
const shortcuts: KeyboardShortcut[] = [];

shortcuts.push({
  name: 'CopyCursorUp',
  description: "Copies an cursor up",

  key: 'ArrowUp',
  ctrl: true,
  alt: true,
  shift: false,

  exec: (code, cursors) => {
    const new_cursors = cursors.slice();
    const first_cursor = new_cursors.reduce((acc, v) => {
      if (v.line === acc.line) return v.column < acc.column ? v : acc;
      return v.line < acc.line ? v : acc;
    }, new_cursors[0])

    if (first_cursor.line < 1) return;
    new_cursors.push(new Cursor(first_cursor.line - 1, first_cursor.column));

    return {
      code,
      cursors: new_cursors
    }
  }
});
shortcuts.push({
  name: 'CopyCursorDown',
  description: "Copies an cursor down",

  key: 'ArrowDown',
  ctrl: true,
  alt: true,
  shift: false,

  exec: (code, cursors) => {
    const new_cursors = cursors.slice();
    const last_cursor = new_cursors.reduce((acc, v) => {
      if (v.line === acc.line) return v.column > acc.column ? v : acc;
      return v.line > acc.line ? v : acc;
    }, new_cursors[0])
    
    if (last_cursor.line >= code.split('\n').length - 1) return;
    new_cursors.push(new Cursor(last_cursor.line + 1, last_cursor.column));

    return {
      code,
      cursors: new_cursors
    }
  }
});

export default shortcuts;