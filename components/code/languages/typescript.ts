import { ArrayToken, Token, ValueToken } from "../tokenizer";

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
  'interface',
  'new'
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

export default function tokenize(code: string, tokens: string[]) {
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
      if (tokens[i + 1] && !/\W/g.test(tokens[i + 1])) {
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
      if (next_token && !/\D/g.test(next_token)) new_tokens.push(NUMBER(token, pos)); else new_tokens.push(OPERATOR(token, pos));
      continue;
    }

    new_tokens.push(token);
  }

  if (env.string) new_tokens.push(STRING(code.slice(env.string.pos), env.string.pos));
  if (env.comment) new_tokens.push(COMMENT(code.substr(env.comment.pos), env.comment.pos));
  return new_tokens;
}