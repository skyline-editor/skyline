export interface ValueToken {
  type: 'string' | 'number' | 'boolean' | 'keyword' | 'variable' | 'comment' | 'static';
  value: string;
}
export interface ArrayToken {
  type: 'parentheses' | 'brackets' | 'braces';
  value: Token[];
}

const STRING = (value: string) => ({ type: 'string', value }) as ValueToken;
const NUMBER = (value: string) => ({ type: 'number', value }) as ValueToken;
const BOOLEAN = (value: string) => ({ type: 'boolean', value }) as ValueToken;
const KEYWORD = (value: string) => ({ type: 'keyword', value }) as ValueToken;
const VARIABLE = (value: string) => ({ type: 'variable', value }) as ValueToken;
const COMMENT = (value: string) => ({ type: 'comment', value }) as ValueToken;

const STATIC = (value: string) => ({ type: 'static', value }) as ValueToken;

const PARENTHESES = (value: Token[]) => ({ type: 'parentheses', value }) as ArrayToken;
const BRACKETS = (value: Token[]) => ({ type: 'brackets', value }) as ArrayToken;
const BRACES = (value: Token[]) => ({ type: 'braces', value }) as ArrayToken;

export type Token = ValueToken | ArrayToken | string;

const colors = {
  string: '#F1FA8C',
  number: '#FF4242',
  boolean: '#508BFF',
  static: '#508BFF',
  keyword: '#FF79C6',
  variable: '#50FA7B',
  comment: '#555555',
};

let list_id = 0;

export function codeFromTokens(tokens: Token[]) {
  return tokens.map(token => {
    if (typeof token === 'string') return token;
    if (token.type in colors) return (<span style={{ color: colors[token.type] }} key={list_id++} >{token.value}</span>);

    if (typeof token.value !== 'string') {
      const code = codeFromTokens(token.value);
      if (token.type === 'parentheses') return ['(', code, ')'];
      if (token.type === 'brackets') return ['{', code, '}'];
      if (token.type === 'braces') return ['[', code, ']'];
    }
    return token.value;
  });
}


const breaking_chars = [
  '.',
  ':',
  ';',
  '{',
  '}',
  '(',
  ')',
  '[',
  ']',
  '<',
  '>',
  '+',
  '-',
  '*',
  '/',
  '%',
  '&',
  '|',
  '^',
  '=',
  '!',
  '~',
  '?',
  '*',

  //strings
  '\\',
  '\'',
  '`',
  '"',

  // non visibles
  ' ',
  '\n',
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
  '=',
  '=>',
  'let',
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

interface RawToken {
  type: 'raw';
  value: string;

  pos: number;
}

export function tokenize(code: string) {
  const tokens: RawToken[] = [];
  let current_token: RawToken = {
    type: 'raw',
    value: '',

    pos: 0,
  };

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (breaking_chars.includes(char)) {
      if (current_token.value) tokens.push(current_token);
      tokens.push({
        type: 'raw',
        value: char,

        pos: i,
      });
      current_token = {
        type: 'raw',
        value: '',
    
        pos: i + 1,
      };
    } else {
      current_token.value += char;
    }
  }
  if (current_token) tokens.push(current_token);

  const new_tokens: Token[] = [];
  const env = {
    comment: null,
    string: null,
    brackets: [],
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (env.string) {
      const length = token.pos - env.string.pos;
      const previous_token = tokens[i - 1];
      if (previous_token.value != '\\' && token.value == env.string.value) {
        const value = code.substr(env.string.pos, length + 1);
        new_tokens.push(STRING(value));

        env.string = null;
        continue;
      }

      continue;
    }
    if (env.comment) {
      const length = token.pos - env.comment.pos;
      const next_token = tokens[i + 1]?.value ?? '';

      const value = token.value == '\n' ? '\n' : `${token.value}${next_token}`;

      const comment_end = (env.comment.value == '//' && value == '\n') || (env.comment.value == '/*' && value == '*/');
      if (comment_end) {
        const value = code.substr(env.comment.pos, length + (token.value == '\n' ? 0 : 2));
        new_tokens.push(COMMENT(value));
        if (token.value == '\n') i--;
        if (token.value != '\n') i++;
        env.comment = null;
      }
      continue;
    }
    if (token.value == '/') {
      const next_token = tokens[i + 1];
      if (next_token && (next_token.value == '/' || next_token.value == '*')) {
        env.comment = {
          value: token.value + next_token.value,
          pos: token.pos,
        };
        continue;
      }
    }

    if (env.brackets.length > 0 && token.value == env.brackets[env.brackets.length - 1].closing) {
      const pos = env.brackets.pop().pos;
      const value = new_tokens.splice(pos, new_tokens.length - pos);

      if (token.value == ')') new_tokens.push(PARENTHESES(value));
      if (token.value == ']') new_tokens.push(BRACES(value));
      if (token.value == '}') new_tokens.push(BRACKETS(value));

      continue;
    }

    if (brackets.includes(token.value)) {
      let closing = '';
      if (token.value == '(') closing = ')';
      if (token.value == '[') closing = ']';
      if (token.value == '{') closing = '}';

      env.brackets.push({
        value: token.value,
        pos: new_tokens.length,
        closing,
      });
      continue;
    }

    if (strings.includes(token.value)) {
      const previous_token = tokens[i - 1];
      if (!previous_token || previous_token.value != '\\') {
        env.string = {
          value: token.value,
          pos: token.pos,
        };
        continue;
      }
    }

    const keyword = keywords.map(v => {
      let total = '';
      let j = 0;
      while (v.startsWith(total) && total.length <= v.length && tokens.length > i + j) {
        total += tokens[i + j].value;
        if (total == v) return [v, j] as [string, number];
        j++;
      }
      return null;
    }).filter(v => v).sort((a, b) => b[0].length - a[0].length)[0];

    if (keyword) {
      new_tokens.push(KEYWORD(keyword[0]));
      i += keyword[1];
      continue;
    }

    if (token.value == 'true' || token.value == 'false') {
      new_tokens.push(BOOLEAN(token.value));
      continue;
    }

    if (!/\D/g.test(token.value)) {
      new_tokens.push(NUMBER(token.value));
      continue;
    }
    
    if (statics.includes(token.value)) {
      new_tokens.push(STATIC(token.value));
      continue;
    }

    if (!/\W/g.test(token.value)) {
      new_tokens.push(VARIABLE(token.value));
      continue;
    }

    if (token.value == '.') {
      const next_token = tokens[i + 1];
      if (next_token && !/\D/g.test(next_token.value)) new_tokens.push(NUMBER(token.value)); else new_tokens.push(KEYWORD(token.value));
      continue;
    }

    new_tokens.push(token.value);
  }

  return new_tokens;
}