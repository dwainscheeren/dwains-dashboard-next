import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const localesDir = path.resolve('src/i18n/locales');
const localeFiles = fs
  .readdirSync(localesDir)
  .filter((file) => file.endsWith('.ts'))
  .sort((left, right) => {
    if (left === 'en.ts') return -1;
    if (right === 'en.ts') return 1;
    return left.localeCompare(right);
  });
const placeholderPattern = /\{[a-zA-Z0-9_]+\}/g;
const errors = [];

function readLocale(file) {
  const source = fs.readFileSync(path.join(localesDir, file), 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const values = new Map();
  const visit = (node) => {
    if (ts.isPropertyAssignment(node) && ts.isStringLiteralLike(node.name) && ts.isStringLiteralLike(node.initializer)) {
      if (values.has(node.name.text)) errors.push(`${file}: duplicate ${node.name.text}`);
      values.set(node.name.text, node.initializer.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return values;
}

const dictionaries = Object.fromEntries(localeFiles.map((file) => [file, readLocale(file)]));
const english = dictionaries['en.ts'];
const sourceLiterals = new Set();
const dynamicPatterns = [];
const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const keyPrefix = /^[a-z_][a-z0-9_.-]*\.[a-z0-9_.-]*$/i;

function literalChoices(node) {
  if (ts.isStringLiteralLike(node)) return [node.text];
  return ts.isConditionalExpression(node)
    ? [...literalChoices(node.whenTrue), ...literalChoices(node.whenFalse)]
    : [];
}

function concatenatedPrefix(node) {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = concatenatedPrefix(node.left);
    return left === undefined ? undefined : left + (concatenatedPrefix(node.right) || '');
  }
  return undefined;
}

function sourceFilesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFilesIn(fullPath);
    return entry.isFile() && fullPath.endsWith('.ts') ? [fullPath] : [];
  });
}

function calledFunctionName(expression) {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  return undefined;
}

const translationCalls = new Map([
  ['_t', { keyIndex: 0, plural: false }],
  ['_tp', { keyIndex: 0, plural: true }],
  ['ddLocalize', { keyIndex: 1, plural: false }],
  ['ddLocalizePlural', { keyIndex: 1, plural: true }],
]);

for (const file of sourceFilesIn(path.resolve('src'))) {
  if (file.startsWith(localesDir + path.sep)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isStringLiteralLike(node)) sourceLiterals.add(node.text);
    if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text, ...node.templateSpans.map(span => span.literal.text)];
      if (keyPrefix.test(parts[0])) dynamicPatterns.push(new RegExp('^' + parts.map(escapePattern).join('.*') + '$'));
    }
    if (ts.isBinaryExpression(node)) {
      const prefix = concatenatedPrefix(node);
      if (prefix && keyPrefix.test(prefix)) dynamicPatterns.push(new RegExp('^' + escapePattern(prefix) + '.*$'));
    }
    if (ts.isCallExpression(node)) {
      const call = translationCalls.get(calledFunctionName(node.expression));
      const argument = call ? node.arguments[call.keyIndex] : undefined;
      if (call && argument) for (const key of literalChoices(argument)) {
        const exists = call.plural
          ? english.has(`${key}.one`) && english.has(`${key}.other`)
          : english.has(key);
        if (!exists) {
          const position = sourceFile.getLineAndCharacterOfPosition(argument.getStart(sourceFile));
          errors.push(`${path.relative(process.cwd(), file)}:${position.line + 1}: unknown translation key ${key}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

for (const file of localeFiles) {
  const dictionary = dictionaries[file];
  for (const [key, value] of english) {
    if (!dictionary.has(key)) {
      errors.push(`${file}: missing ${key}`);
      continue;
    }
    if (!dictionary.get(key)?.trim()) errors.push(`${file}: empty ${key}`);
    const expected = [...value.matchAll(placeholderPattern)].map((match) => match[0]).sort();
    const actual = [...dictionary.get(key).matchAll(placeholderPattern)].map((match) => match[0]).sort();
    if (expected.join('|') !== actual.join('|')) errors.push(`${file}: placeholders differ for ${key}`);
  }
  for (const key of dictionary.keys()) {
    if (english.has(key)) continue;
    const pluralBase = key.replace(/\.(zero|two|few|many)$/, '');
    const fallback = english.get(`${pluralBase}.other`);
    if (pluralBase === key || fallback === undefined || !english.has(`${pluralBase}.one`)) {
      errors.push(`${file}: unknown ${key}`);
      continue;
    }
    const value = dictionary.get(key);
    if (!value?.trim()) errors.push(`${file}: empty ${key}`);
    const expected = [...fallback.matchAll(placeholderPattern)].map(match => match[0]).sort();
    const actual = [...value.matchAll(placeholderPattern)].map(match => match[0]).sort();
    if (expected.join('|') !== actual.join('|')) errors.push(`${file}: placeholders differ for ${key}`);
  }
}

for (const key of english.keys()) {
  const base = key.replace(/\.(one|other)$/, '');
  if (!sourceLiterals.has(key) && !sourceLiterals.has(base) && !dynamicPatterns.some(pattern => pattern.test(key))) {
    errors.push(`en.ts: unused translation key ${key}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`${localeFiles.length} locales complete (${english.size} shared keys, optional language-specific plurals validated).`);
