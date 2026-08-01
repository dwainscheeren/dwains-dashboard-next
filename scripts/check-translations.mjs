import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const localesDir = path.resolve('src/i18n/locales');
const localeFiles = ['en.ts', 'nl.ts', 'de.ts', 'fr.ts', 'es.ts'];
const placeholderPattern = /\{[a-zA-Z0-9_]+\}/g;

function readLocale(file) {
  const source = fs.readFileSync(path.join(localesDir, file), 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const values = new Map();
  const visit = (node) => {
    if (ts.isPropertyAssignment(node) && ts.isStringLiteralLike(node.name) && ts.isStringLiteralLike(node.initializer)) {
      values.set(node.name.text, node.initializer.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return values;
}

const dictionaries = Object.fromEntries(localeFiles.map((file) => [file, readLocale(file)]));
const english = dictionaries['en.ts'];
const errors = [];

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
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const call = translationCalls.get(calledFunctionName(node.expression));
      const argument = call ? node.arguments[call.keyIndex] : undefined;
      if (call && argument && ts.isStringLiteralLike(argument)) {
        const key = argument.text;
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
    if (!english.has(key)) errors.push(`${file}: unknown ${key}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`${localeFiles.length} locales complete (${english.size} keys each).`);
