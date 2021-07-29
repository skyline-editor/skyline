import { Cursor } from "./cursor";

// to see if the next char is an bracket

let extra = '';
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

  cursor = cursor.validate(code, false, { column: true });

  const lines = code.split('\n');
  const line = lines[cursor.line];
  const column = cursor.column;
  if (mode === 'delete') {
    const direction = args[0] as number;

    const back = Math.max(0, -direction);
    const front = Math.max(0, direction);

    const lineText = line.substring(0, column - back);
    const lineEnd = line.substring(column + front);

    if (cursor.column < back || cursor.column > line.length - front) {
      if (back) {
        if (cursor.line > 0) {
          const lineText = lines[cursor.line - 1];
          const lineEnd = line;
  
          const newLine = lineText + lineEnd;
          lines.splice(cursor.line - 1, 2, newLine);
  
          cursor.line--;
          cursor.column = lineText.length;
          affected.map(v => {
            if (v.line === cursor.line) v.column += lineText.length;
            v.line -= 1;
          });
        }
      }
      if (front) {
        if (cursor.line < lines.length - 1) {
          const lineText = line;
          const lineEnd = lines[cursor.line + 1];
  
          const newLine = lineText + lineEnd;
          lines.splice(cursor.line, 2, newLine);

          cursor.column = lineText.length;
          affected.map(v => {
            if (v.line === cursor.line + 1) v.column += lineText.length;
            v.line -= 1;
          });
        }
      }
    } else {
      const newLine = lineText + lineEnd;
      lines.splice(cursor.line, 1, newLine);

      cursor.column -= back;
      affected.map(v => v.column += v.line === cursor.line ? -1 : 0);
    }
  }

  if (mode === 'insert') {
    const text = args[0] as string;
    extra = '';
        
    if (key === 'Tab') {
      const skip = [
        '(',
        ')',
        '{',
        '}',
        '[',
        ']',
        '\'',
        '"'
      ];
      
      const nextChar = line[cursor.column];
      if (nextChar && skip.includes(nextChar)) {
        cursor.column += 1;
        return lines.join('\n');
      }
    }
    
    if (key === ' ') {
      const nextChar = line[cursor.column];
      const prevChar = line[cursor.column - 1];
      const t = prevChar + nextChar;
      const spacing = [
        '{}',
        '[]',
        '()',
      ];
      
      if (nextChar && prevChar && spacing.includes(t)) extra = ' ';
    }  

    
    if (text === '(') extra = ')';
    if (text === '{') extra = '}';
    if (text === '[') extra = ']';
    if (text === '<') extra = '>';
    if (text === '"') extra = '"';
    if (text === '\'') extra = '\'';
    if (text === '`') extra = '`';

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

    affected.map(v => {
      if (text === '\n') return v.line++;
      v.column += v.line === cursor.line ? text.length : 0
    });
  }
  
  return lines.join('\n');
}

export function addText(code: string, key: string, cursors: Cursor[]) : { code: string, cursors: Cursor[] } {
  if (key === extra) {
    extra = '';

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
    cursor = cursor.validate(code);
    return !cursors.find((v, j) => {
      v = v.validate(code);
      if (i >= j) return false;
      return v.line === cursor.line && v.column === cursor.column
    });
  });

  return {
    code,
    cursors,
  };
}