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
};

let list_id = 0;

export function highlight(code: string, language: string) {
  const tokens = tokenize(code, language);
  const html = codeFromTokens(tokens);
  return html;
}

function getElemsFromTokens(tokens: Token[]) {
  const elems = [];
  for (const token of tokens) {
    if (typeof token === 'string') {
      elems.push(token);
      continue;
    }
    if (token.type in colors && typeof token.value === 'string') {
      const lines = token.value.split('\n');
      const result = [];
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) result.push('\n');
        if (token.type == 'comment') {
          result.push(<span style={{ color: colors[token.type], fontStyle: 'italic' }} key={list_id++} >{lines[i]}</span>);
          continue;
        }
        result.push(<span style={{ color: colors[token.type] }} key={list_id++} >{lines[i]}</span>);
      }
      
      elems.push(...result);
      continue;
    }

    if (typeof token.value !== 'string') {
      const code = getElemsFromTokens(token.value);
      if (token.type === 'parentheses') elems.push(...code);
      if (token.type === 'brackets') elems.push(...code);
      if (token.type === 'braces') elems.push(...code);
      continue;
    }
    elems.push(token.value);
  }
  return elems;
}
export function codeFromTokens(tokens: Token[]) {
  const elems = getElemsFromTokens(tokens);
  if (elems[elems.length - 1] !== '\n') elems.push('\n');

  const lines = [];
  let line = [];
  for (let i = 0; i < elems.length; i++) {
    if (elems[i] === '\n') {
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