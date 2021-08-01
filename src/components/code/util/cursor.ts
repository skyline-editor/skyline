export interface Cursor {
  line: number;
  column: number;
}

export function validateCursorSome(code: string, cursor: Cursor, change: { line?: boolean, column?: boolean}) : Cursor {
  const validated = validateCursor(code, cursor);

  cursor.line = change.line ? validated.line : cursor.line;
  cursor.column = change.column ? validated.column : cursor.column;

  return cursor;
}

export function validateCursor(code: string, cursor: Cursor) : Cursor {
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