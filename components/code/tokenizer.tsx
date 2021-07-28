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

const STRING = (value: string, pos: number) => ({ type: 'string', value, pos }) as ValueToken;
const NUMBER = (value: string, pos: number) => ({ type: 'number', value, pos }) as ValueToken;
const BOOLEAN = (value: string, pos: number) => ({ type: 'boolean', value, pos }) as ValueToken;
const KEYWORD = (value: string, pos: number) => ({ type: 'keyword', value, pos }) as ValueToken;
const VARIABLE = (value: string, pos: number) => ({ type: 'variable', value, pos }) as ValueToken;
const COMMENT = (value: string, pos: number) => ({ type: 'comment', value, pos }) as ValueToken;
const STATIC = (value: string, pos: number) => ({ type: 'static', value, pos }) as ValueToken;
const OPERATOR = (value: string, pos: number) => ({ type: 'operator', value, pos }) as ValueToken;

const PARENTHESES = (value: Token[], pos: number) => ({ type: 'parentheses', value, pos }) as ArrayToken;
const BRACKETS = (value: Token[], pos: number) => ({ type: 'brackets', value, pos }) as ArrayToken;
const BRACES = (value: Token[], pos: number) => ({ type: 'braces', value, pos }) as ArrayToken;

export type Token = ValueToken | ArrayToken | string;

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

export function highlight(code: string) {
  console.time('highlight');
  console.time('tokenize');
  const tokens = tokenize(code);
  console.timeEnd('tokenize');
  
  console.time('code');
  const html = codeFromTokens(tokens);
  console.timeEnd('code');
  
  console.timeEnd('highlight');
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

const invisible = [
  ' ',
  '\n',
  '\t'
];

const strings = [
  '\'',
  '`',
  '"',
];
const keywords = [
  'import',
  'from',
  'const',
  'let',
  'var',
  'function',
  'class',
  'extends',
  'return',
  'if',
  'else',
  'while',
  'for',
  'with',
  'break',
  'continue',
  'switch',
  'case',
  'default',
  'try',
  'catch',
  'finally',
  'throw',
  'delete',
  'typeof',
  'instanceof',
  'in',
  'of',
  'await',
  'yield',
  'await',
  'async',
  'as',
  'export',
  'type',
  'interface'
];
const brackets = [
  '{',
  '(',
  '[',
];
const statics = [
  'null',
  'undefined'
];
const operators = [
  '=',
  '=>',
  '+',
  '-',
  '*',
  '/',
  '%',
  '&',
  '|',
  '^',
  '!',
  '~',
];

const blank_vars = [
  'var',
  'let',
];

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

export function tokenize(code: string) {
  console.time('raw_tokenize');
  const tokens = tokenize_raw(code);
  console.timeEnd('raw_tokenize');

  console.time('2_tokenize');
  const new_tokens: Token[] = [];
  const env = {
    comment: null,
    string: null,
    brackets: [],
  };

  let pos = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i - 1]) pos += tokens[i - 1].length;
    const previous_token = tokens[i - 1];
    const token = tokens[i];

    if (env.string) {
      if (token === '\n' && env.string.value !== '`') {
        new_tokens.push(STRING(code.slice(env.string.pos, pos), env.string.pos));
        new_tokens.push('\n');
        env.string = null;
        continue;
      }
      if (previous_token !== '\\' && token === env.string.value) {
        new_tokens.push(STRING(code.slice(env.string.pos, pos + 1), env.string.pos));
        env.string = null;
        continue;
      }
      
      continue;
    }
    if (env.comment) {
      const length = pos - env.comment.pos;
      const next_token = tokens[i + 1] ?? '';
      const value = token + next_token;

      if (env.comment.value === '//' && token === '\n') {
        const value = code.substr(env.comment.pos, length);
        new_tokens.push(COMMENT(value, env.comment.pos));
        
        pos -= tokens[i - 1].length;
        i--;
        env.comment = null;
        continue;
      }
      if (env.comment.value === '/*' && value === '*/') {
        const value = code.substr(env.comment.pos, length + 2);
        new_tokens.push(COMMENT(value, env.comment.pos));
        
        i++;
        pos++;
        env.comment = null;
        continue;
      }

      continue;
    }
    if (token === '/') {
      const next_token = tokens[i + 1] ?? '';
      if (next_token === '/' || next_token === '*') {
        env.comment = {
          value: token + next_token,
          pos,
        };
        continue;
      }
    }

    if (env.brackets.length > 0 && token === env.brackets[env.brackets.length - 1].closing) {
      const pos = env.brackets.pop().pos;
      const value = new_tokens.splice(pos, new_tokens.length - pos);

      if (token === ')') new_tokens.push(PARENTHESES(value, pos));
      if (token === ']') new_tokens.push(BRACES(value, pos));
      if (token === '}') new_tokens.push(BRACKETS(value, pos));

      new_tokens.push(token);
      continue;
    }

    if (brackets.includes(token)) {
      let closing = '';
      if (token === '(') closing = ')';
      if (token === '[') closing = ']';
      if (token === '{') closing = '}';

      new_tokens.push(token);

      env.brackets.push({
        value: token,
        pos: new_tokens.length,
        closing,
      });
      continue;
    }

    if (strings.includes(token)) {
      const previous_token = tokens[i - 1];
      if (!previous_token || previous_token !== '\\') {
        env.string = {
          value: token,
          pos,
        };
        continue;
      }
    }

    if (blank_vars.includes(token)) {
      new_tokens.push(KEYWORD(token, pos));

      let between = "";
      while (invisible.includes(tokens[i + 1])) {
        pos += tokens[i].length;
        i++;
        between += tokens[i];
      }
      
      new_tokens.push(...between);
      if (!/\W/g.test(tokens[i + 1])) {
        new_tokens.push(tokens[i + 1]);
        pos += tokens[i].length;
        i++;
      }
      continue;
    }

    if (keywords.includes(token)) {
      new_tokens.push(KEYWORD(token, pos));
      continue;
    }

    if (token == 'true' || token == 'false') {
      new_tokens.push(BOOLEAN(token, pos));
      continue;
    }

    if (statics.includes(token)) {
      new_tokens.push(STATIC(token, pos));
      continue;
    }

    if (!/\D/g.test(token)) {
      new_tokens.push(NUMBER(token, pos));
      continue;
    }

    let operator = '';
    for (let j = 0; j < operators.length; j++) {
      if (operators[j].length <= operator.length) continue;

      const t = code.substr(pos, operators[j].length);
      if (t === operators[j]) operator = operators[j];
    }

    if (operator) {
      let total = token.length;
      while (total < operator.length) {
        i++;
        total += tokens[i].length;
      }

      pos += total;
      pos -= tokens[i].length;

      new_tokens.push(OPERATOR(operator, pos));
      continue;
    }

    if (!/\W/g.test(token)) {
      new_tokens.push(VARIABLE(token, pos));
      continue;
    }

    if (token == '.') {
      const next_token = tokens[i + 1];
      if (next_token && !/\D/g.test(next_token)) new_tokens.push(NUMBER(token, pos)); else new_tokens.push(token);
      continue;
    }

    new_tokens.push(token);
  }

  if (env.string) new_tokens.push(STRING(code.slice(env.string.pos), env.string.pos));
  if (env.comment) new_tokens.push(COMMENT(code.substr(env.comment.pos), env.comment.pos));

  console.timeEnd('2_tokenize');
  return new_tokens;
}

function getTokenFromPos(tokens: Token[], pos: number) {

}