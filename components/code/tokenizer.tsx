export interface ValueToken {
  type: 'string' | 'number' | 'boolean' | 'keyword' | 'variable' | 'comment' | 'static' | 'operator';
  value: string;
  pos?: number;
}
export interface ArrayToken {
  type: 'parentheses' | 'brackets' | 'braces';
  value: Token[];
  pos?: number;
}
export type Token = ValueToken | ArrayToken | string;
import languages from './languages';


const colors = {
  string: '#C9FFD8',
  number: '#E1C9FF',
  operator: '#FF79C6',
  boolean: '#9A92FF',
  static: '#9A92FF',
  keyword: '#79CFFF',
  variable: '#83ADFF',
  propery: '#83ADFF',
  comment: '#46667E',
  normal: '#f8f8f2'
};

interface ColoredText {
  text: string;
  color: string;
}

let list_id = 0;

export function highlight(code: string, language: string) {
  const tokens = tokenize(code, language);
  const html = codeFromTokens(tokens);
  return html;
}

function getElemsFromTokens(tokens: Token[]) {
  const elems: ColoredText[] = [];
  for (const token of tokens) {
    if (typeof token === 'string' || typeof token.value === 'string') {
      const value = typeof token === 'string' ? token : token.value as string;

      const lines = value.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) elems.push(null);
        elems.push({
          text: lines[i],
          color: typeof token === 'string' ? colors.normal : colors[token.type] ?? colors.normal
        });
      }
      continue;
    }

    if (typeof token.value !== 'string') {
      elems.push(...getElemsFromTokens(token.value));
      continue;
    }
  }
  return elems;
}
export function codeFromTokens(tokens: Token[]) {
  const elems = getElemsFromTokens(tokens);
  if (elems[elems.length - 1]) elems.push(null);

  const lines: ColoredText[][] = [];
  let line: ColoredText[] = [];
  for (let i = 0; i < elems.length; i++) {
    if (!elems[i]) {
      lines.push(line);
      line = [];
      continue;
    }
    line.push(elems[i]);
  }

  return lines;
}

function tokenize_raw(code: string) : string[] {
  const tokens: string[] = [];
  const matches = code.matchAll(/\W/g);

  let current_token = 0;
  for (const match of matches) {
    const i = match.index;

    if (current_token != i) tokens.push(code.slice(current_token, i));
    tokens.push(match[0]);
    current_token = i + 1;
  }

  if (current_token < code.length) tokens.push(code.slice(current_token))
  return tokens;
}

export function tokenize(code: string, language: string) {
  const tokenizer = languages[language];
  if (typeof tokenizer === 'undefined') throw new Error(`Language ${language} not found`);

  const tokens = tokenize_raw(code);
  const new_tokens: Token[] = tokenizer(code, tokens);
  return new_tokens;
}

function getTokenFromPos(tokens: Token[], pos: number) {

}