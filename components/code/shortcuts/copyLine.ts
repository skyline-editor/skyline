import { KeyboardShortcut } from "../codeEditor";
const shortcuts: KeyboardShortcut[] = [];

shortcuts.push({
  name: 'CopyLineUp',
  description: "Copies an line up",

  key: 'ArrowUp',
  ctrl: false,
  alt: true,
  shift: true,

  exec: (code, cursors) => {
    cursors = cursors.sort((a, b) => {
      if (a.line < b.line) return -1;
      if (a.line > b.line) return 1;
      if (a.column < b.column) return -1;
      if (a.column > b.column) return 1;
      return 0;
    });

    const lines = code.split('\n');
    let last = null;
    for (let i = 0; i < cursors.length; i++) {
      const cursor = cursors[i];

      if (last && last.line === cursor.line) continue;
      last = cursor;

      const affected = cursors.slice(i + 1);

      const line = lines[cursor.line];
      lines.splice(cursor.line, 0, line);

      affected.map(v => v.line += (v.line == cursor.line) ? 0 : 1);
    }

    return {
      code: lines.join('\n'),
      cursors
    }
  }
});
shortcuts.push({
  name: 'CopyLineDown',
  description: "Copies an line down",

  key: 'ArrowDown',
  ctrl: false,
  alt: true,
  shift: true,

  exec: (code, cursors) => {
    cursors = cursors.sort((a, b) => {
      if (a.line < b.line) return -1;
      if (a.line > b.line) return 1;
      if (a.column < b.column) return -1;
      if (a.column > b.column) return 1;
      return 0;
    });

    const lines = code.split('\n');
    let last = null;
    for (let i = 0; i < cursors.length; i++) {
      const cursor = cursors[i];
      
      if (last && last.line === cursor.line) continue;
      last = cursor;

      const affected = cursors.slice(i + 1);

      const line = lines[cursor.line];
      lines.splice(cursor.line, 0, line);

      cursor.line++;
      affected.map(v => v.line++);
    }

    return {
      code: lines.join('\n'),
      cursors
    }
  }
});

export default shortcuts;