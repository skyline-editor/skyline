import { Selection } from './selection';

export class Cursor {
  line: number;
  column: number;
  selection?: Selection;

  constructor(line: number, column: number) {
    this.line = line ?? 0;
    this.column = column ?? 0;
  }

  clone(): Cursor {
    return new Cursor(this.line, this.column);
  }

  validate(code: string, clone?: boolean, change?: { line?: boolean, column?: boolean}): Cursor {
    const lines = code.split('\n');

    clone = clone ?? true;
    change = change ?? {
      line: true,
      column: true
    };

    let line = this.line;
    let column = this.column;

    if (change.line) {
      if (line < 0) line = 0;
      if (line >= lines.length) line = lines.length - 1;
    }
    
    if (change.column) {
      if (column < 0) column = 0;
      if (column > lines[line].length) column = lines[line].length;
    }

    if (clone) {
      return new Cursor(line, column);
    } else {
      this.line = line;
      this.column = column;
      return this;
    }
  }

  // intended to be used in array.sort()
  compare(other: Cursor): number {
    return Cursor.compare(this, other);
  }

  static compare(a: Cursor, b: Cursor): number {
    if (a.line < b.line) return -1;
    if (a.line > b.line) return 1;
    if (a.column < b.column) return -1;
    if (a.column > b.column) return 1;
    return 0;
  }

  move(code: string, change: { line?: number, column?: number }, clone?: boolean) : Cursor {
    clone = clone ?? true;
    if (clone) return this.clone().move(code, change, false);

    const lines = code.split('\n');
    const validated = this.validate(code);
  
    if (change.line) {
      this.line = validated.line + change.line;
      if (this.line < 0) this.line = 0;
      if (this.line >= lines.length) this.line = lines.length - 1;
    }
  
    if (change.column) {
      this.column = validated.column + change.column;
      if (this.column < 0) {
        this.line--;
  
        if (this.line < 0) {
          this.line = 0;
          this.column = 0;
        } else {
          this.column = lines[this.line].length;
        }
      }
      if (this.column > lines[this.line].length) {
        this.line++;
  
        if (this.line >= lines.length) {
          this.line = lines.length - 1;
          this.column = lines[this.line].length;
        } else {
          this.column = 0;
        }
      }
    }
    
    return this;
  }
}